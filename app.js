import { Visual } from "./visual.js";

class App {
  constructor() {
    this.setWebgl();

    WebFont.load({
      //웹 폰트를 가져다 쓰기 위한 메소드이다.
      google: {
        families: ["Hind:700"], //구글 폰트 중 Hind라는 폰트 굵기 700짜리를 가져온다.
      },

      fontactive: () => {
        //이 메소드는 각 글꼴이 렌더링 될때 한번씩 실행된다.
        this.visual = new Visual(); //비주얼 클래스를 비주얼 변수에 담는다.

        window.addEventListener("resize", this.resize.bind(this), false); //addEventListener의 resize는 윈도우 객체에서만 실행 할 수 있다.
        this.resize(); //resize실행 시킨다.//왜 두번이지..//관습적으로 쓰는건가..
        requestAnimationFrame(this.animate.bind(this)); //매개변수로 무조건 콜백 함수가 들어가야 한다. 다시 되돌아오는 재귀함수를 의미한다. 자신이 들어있는 함수를 다시 불러줘야한다.
      },
    });
  }
  setWebgl() {
    this.renderer = new PIXI.Renderer({
      //렌더러들의 property중에 필요한것들만 바꿔준다.
      width: document.body.clientWidth,
      hegiht: document.body.clientHeight,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio > 1 ? 2 : 1, //레티나 디스플레이 일때는 2가 되고 아닌것은 1이 된다.
      autoDensity: true, //해상도를 자동으로 바꿔주는 기능
      powerPreference: "high-performance", //컴터 사양만 받쳐주면 하이퍼포먼스 가능
      backgroundColor: 0xffffff, //기본은 검정으로 되어있다
    });

    document.body.appendChild(this.renderer.view); //view 메소드를 통해 캔버스 엘리먼트로 return히고 body테그 하위에 추가한다.

    this.stage = new PIXI.Container(); //Container는 다른 여러 객체를 포함하는 가장 기본적인 컨테이너이다.
  }
  resize() {
    this.stageWidth = document.body.clientWidth; //현재 화면의 폭으로 stageWidth 조정
    this.stageHeight = document.body.clientHeight; //위와 동일
    this.renderer.resize(this.stageWidth, this.stageHeight); //Webgl의 너비와 폭을 수정한다.

    this.visual.show(this.stageWidth, this.stageHeight, this.stage); //파티클을 배치한다.
  }

  animate(t) {
    //t에는 시간이 들어가는데 시간이 필요허면 이용하면 되고 시간과 관계없이 움직이려면 굳이 필요하진 않다. 아마 페이지가 작동된 시간이 들어가는 듯하다.
    requestAnimationFrame(this.animate.bind(this)); //이게 굳이 앞에 있든 마지막에 있든 상관은 없다.

    this.visual.animate(); //계속 반복되는 계산인 animate메소드이다.

    this.renderer.render(this.stage); //stage를 계속 렌더링 한다.
  }
}

window.onload = () => {
  new App();
};
