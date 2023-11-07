import { useRef, useEffect } from 'react'

const Canvas = (props: any) => {
    const { draw, ...rest } = props
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement) {
    
        const { width, height } = canvas.getBoundingClientRect()
    
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width
          canvas.height = height
          return true // here you can return some usefull information like delta width and delta height instead of just true
          // this information can be used in the next redraw...
        }
    
        return false
      }

    useEffect(() => {
        const canvas = canvasRef.current;
            const context = canvas!.getContext('2d');
            resizeCanvasToDisplaySize(canvas!);
            let frameCount = 0
            let animationFrameId: number;

            const predraw = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
                context.save()
                resizeCanvasToDisplaySize(canvas)
                const { width, height } = context.canvas
                context.clearRect(0, 0, width, height)
              }

            const postdraw = (ctx: CanvasRenderingContext2D) => {
                frameCount++
                ctx.restore()
               }

            //draw
            const render = () => {
                predraw(context!, canvas!);
                draw(context!, frameCount)
                postdraw(context!);
                animationFrameId = window.requestAnimationFrame(render)
              }
              render()

              return () => {
                window.cancelAnimationFrame(animationFrameId)
              }
      }, [draw])


    return <canvas ref={canvasRef} {...rest}></canvas>
}

export default Canvas