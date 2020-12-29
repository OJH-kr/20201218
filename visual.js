import { Text } from "./text.js"; //Text클래스를 가져온다.
import { Particle } from "./particle.js"; //Particle클래스를 가져온다.

export class Visual {
  //비주얼 클래스를 만든다.
  constructor() {
    this.text = new Text(); //음...그러하다.

    this.texture = PIXI.Texture.from("particle.png"); //png파일을 텍스쳐로서 texture에 삽입한다.

    this.particles = []; //입자들이 들어갈 빈 레이어이다.

    this.mouse = {
      //마우스 객체도 만들어준다. 초기 좌표는 다 0이 기본값이고, 반지름은 100이다.
      x: 0,
      y: 0,
      radius: 100,
    };

    document.addEventListener("pointermove", this.onMove.bind(this), false);
    //마우스의 움직임을 document.addEventListener이용하여 받은 뒤,this.onMove.bind(this)로 보낸다. 이 때 바인드를 사용하여 this가 가리키는 객체가 변하지 않도록 고정해주었다. 마지막 false는 원래 디폴드 값이지만 확실하게 해주기 위해 넣은 것 같다.
  }

  show(stageWidth, stageHeight, stage) {
    if (this.container) {
      //container가 존재하면
      stage.removeChild(this.container); //container를 지운다. 스테이지에는 container가 들어가기 때문에 removeChild메소드를 쓸 수 있다.
    }

    this.pos = this.text.setText("J", 2, stageWidth, stageHeight); //set텍스트 메소드를 이용하여 문자를 세팅한다.
    this.container = new PIXI.ParticleContainer(this.pos.length, {
      //particlecontainer가 Container의 extend이기 때문에 addchild를 통해 추가 할 수 있다.
      //매개변수로 파티클들이 들어갈 배열의 길이, 즉, 파티클의 최대 개수를 받는다.
      //sprite 또는 입자들을 렌더링할 때 빠르게 처리하는 컨테이너이다. 단점은 기본적인 포지션, 스케일, 로테이션, 틴트 기능정도만 쓸 수 있고 나머지 고급기능은 쓰지 못한다.
      vertices: false, //변경 할 옵션들만 true로 바꾸고 나머지는 false로 바꿔서 다른 변형이 일어나지 않게 한다.
      position: true,
      rotation: false,
      scale: false,
      uvs: false,
      tint: true,
    });

    stage.addChild(this.container); //스테이지(아마 캔버스)에 컨테이너를 추가한다.

    this.particles = []; //입자들을 초기화시킨다.
    for (let i = 0; i < this.pos.length; i++) {
      //파티클의 수 만큼 파티클을 만든다.
      const item = new Particle(this.pos[i], this.texture); //빈 공간의 파티클의 공간에 파티클을 채워 넣는다.
      this.container.addChild(item.sprite); //컨테이너에 파티클들의 sprite형태를 컨테이너에 추가한다. 이렇게 해야 sprite를 사용 할 수 있다.
      this.particles.push(item); //빈 입자들의 배열에 실질적인 입자들을 채워넣는다.
    }
  }

  animate() {
    for (let i = 0; i < this.particles.length; i++) {
      //입자 레이어들에 대한 for문이다.
      const item = this.particles[i]; //animate의 item변수에 입자들을 순서대로 넣는다.
      const dx = this.mouse.x - item.x; //마우스의 x죄표에서 입자의 x값을 뺀 값을 dx에 대입한다.
      const dy = this.mouse.y - item.y; //위와 동일. 마우스와 입자 사이의 y 방향의 거리를 나타낸다.
      const dist = Math.sqrt(dx * dx + dy * dy); //마우스와 입자 사이의 거리이다.
      const minDist = item.radius + this.mouse.radius; //마우스의 반지름과 입자의 반지름 사이의 거리를 minDist에 삽입한다.

      if (dist < minDist) {
        //마우스와 입자 사이의 거리가 최소거리보다 작으면
        const angle = Math.atan2(dy, dx); //atan2 메소드를 이용하여 양의 x축과 입자 사이의 각도를 구한다. 리턴값은 라디안이다. 이 값은 마우스와 입자 사이의 충돌 각도이다.
        const tx = item.x + Math.cos(angle) * minDist; //입자의 x좌표에 최소거리 일때의 dx를 더한다.
        const ty = item.y + Math.sin(angle) * minDist; //위와 동일. 즉, tx,ty는 최소거리 일때의 mouse.x,mouse.y좌표를 나타낸다. 참고로 현재는 최소거리보다 가까운 상태이기때문에 dx, dy와 값이 다름.
        const ax = tx - this.mouse.x; //tx에 현재 마우스의 x좌표를 뺀다. 즉, 매우 작은 거리 이다.
        const ay = ty - this.mouse.y; //위와 동일.
        item.vx -= ax; //파티클의 속력에 ax만큼을 뺀다.
        item.vy -= ay; //위와동일, particle의 vx,vy속성들을 보러 가보자.
        item.collide(); //충돌시 색상이 변경되는 메소드를 실행시킨다.
      }

      item.draw(); //particle의 draw메소드를 실행시킨다.
    }
  }

  onMove(e) {
    //매개변수 e는 mouseEvent를 나타낸다. 문법적으로 써줘야하는것같다.
    this.mouse.x = e.clientX; //mouseEvent.clientX는 마우스의 X좌표를 나타낸다. 스크린과는 상관없이 현재 보이는 '뷰포트'상에서의 x좌표이다.
    this.mouse.y = e.clientY; //위와 동일
  }
}
