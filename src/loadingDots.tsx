import './loadingDots.css'

/** Three yellow dots using the copied sk-bouncedelay animation. */
export function LoadingDots() {
  return (
    <div className="os-sk-spinner" aria-hidden="true">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  )
}
