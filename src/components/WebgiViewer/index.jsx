import { useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from "react"
import {
  ViewerApp, // View接口，用于创建查看器
  AssetManagerPlugin, // 用于处理资源的下载、管理、缓存、解析、加载和添加到场景。可以添加扩展以加载不同的文件类型以及导出纹理、材料和 GLTF 模型。
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  GammaCorrectionPlugin,
  CanvasSnipperPlugin,
  AssetManagerBasicPopupPlugin
} from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollAnimation } from "../../lib/scroll-animation";

gsap.registerPlugin(ScrollTrigger);


const WebgiViewer = () => {
  const canvasRef = useRef(null);

  // 不需要每次渲染都执行
  const memoizedScrollAnimation = useCallback((position, target, onUpdate) => {
    if (!position || !target || !onUpdate) return;

    scrollAnimation(position, target, onUpdate);
  }, [])

  // 不需要每次渲染时都初始化查看器，使用useCallBack hook
  const setupViewer = useCallback(async () => {
    // 初始化查看器
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    })

    // 添加基本插件
    const manager = await viewer.addPlugin(AssetManagerPlugin)

    // 添加一个popup，当任何资源加载时显示进度
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // camera可以访问模型position target
    const camera = viewer.scene.activeCamera;
    const position = camera.position; // 定义位置
    const target = camera.target; // 定义相机的target

    // 按需使用插件
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    await viewer.addPlugin(BloomPlugin)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    // await viewer.addPlugin(CanvasSnipperPlugin)

    // 添加所有插件后执行一次刷新Pipeline
    viewer.renderer.refreshPipeline()

    // 添加模型文件
    await manager.addFromPath('/scene-black.glb')

    // 去除模型黑色背景
    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    // 禁用活动相机，无法旋转3D模型
    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false })

    // 每次加载网页使其处于页面顶部
    window.scrollTo(0, 0);

    let isNeedUpdate = true;
    const onUpdate = () => {
      isNeedUpdate = true;
      viewer.setDirty();  // 设置为Dirty，表示position和target需要更新
    }
    // 给查看器添加一个时间处理器
    viewer.addEventListener('preFrame', () => {
      if (isNeedUpdate) {
        camera.positionTargetUpdated(true);
        isNeedUpdate = false;
      }
    })

    memoizedScrollAnimation(position, target, onUpdate);

    // 添加用于调试的UI界面
    // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // uiPlugin.setupPlugins<IViewerPlugin>(TonemapPlugin, CanvasSnipperPlugin)
  }, [])


  // 第一次渲染时执行一次
  useEffect(() => {
    setupViewer();
  }, [])

  return (
    <div id="webgi-canvas-container">
      <canvas id="webgi-canvas" ref={canvasRef} />
    </div>
  )
}

export default WebgiViewer;