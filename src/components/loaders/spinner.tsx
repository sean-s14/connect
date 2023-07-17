export default function Spinner(props: { style?: {} }) {
  return (
    <div>
      <style jsx>{`
        @-webkit-keyframes rotate-forever {
          0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }

        @-moz-keyframes rotate-forever {
          0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }

        @keyframes rotate-forever {
          0% {
            -webkit-transform: rotate(0deg);
            -moz-transform: rotate(0deg);
            -ms-transform: rotate(0deg);
            -o-transform: rotate(0deg);
            transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            -ms-transform: rotate(360deg);
            -o-transform: rotate(360deg);
            transform: rotate(360deg);
          }
        }

        .loading-spinner {
          --duration: 1s;
          -webkit-animation-duration: var(--duration);
          -moz-animation-duration: var(--duration);
          animation-duration: var(--duration);
          -webkit-animation-iteration-count: infinite;
          -moz-animation-iteration-count: infinite;
          animation-iteration-count: infinite;
          -webkit-animation-name: rotate-forever;
          -moz-animation-name: rotate-forever;
          animation-name: rotate-forever;
          -webkit-animation-timing-function: linear;
          -moz-animation-timing-function: linear;
          animation-timing-function: linear;
          height: 25px;
          width: 25px;
          border: 1px solid #ffffff;
          display: flex;
        }
      `}</style>
      <span
        className="loading-spinner"
        style={{
          borderRadius: "50%",
          borderRightColor: "transparent",
          ...props.style,
        }}
      ></span>
    </div>
  );
}
