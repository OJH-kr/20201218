const FRICTION = 0.98; //전역변수들을 지정한다.
const COLOR_SPEED = 0.12; //이 전역 변수들은 수정 할 수 없다.
const MOVE_SPEED = 0.88;

export class Particle {
  //Particle이라는 클래스를 내보낸다. 입자와 관련된 정보를 가지고 있다. 실질적인 입자의 모든 정보를 가지고 있다.
  constructor(pos, texture) {
    //constructor로 기본적인 데이터를 설정한다. 매개변수로 위치와 텍스쳐 값을 받는다.
    this.sprite = new PIXI.Sprite(texture); //sprite는 PIXI에서 "텍스쳐"를 사용하기 위한 기본적인 메소드이다.
    this.sprite.scale.set(0.06); //텍스처의 스케일을 0.06으로 설정한다. x,y값을 넣을 수 있는데 하나의 값만 넣으면 x,y둘다 그 값으로 바뀐다.

    this.savedX = pos.x; //초기x좌표를 저장한다
    this.savedY = pos.y; //초기y좌표를 저장한다.
    this.x = pos.x; //x좌표를 지정한다.
    this.y = pos.y; //y좌표를 지정한다.
    this.sprite.x = this.x; //텍스처의 현재 x좌표에 파티클의 좌표를 삽입한다.
    this.sprite.y = this.y; //텍스처의 현재 y좌표에 파티클의 좌표를 삽입한다.
    this.vx = 0; //x방향의 속도.
    this.vy = 0; //y방향의 속도.
    this.radius = 10; //반지름 어따 쓰는걸까? 찾음. 마우스와 입자사이의 거리를 판별할때 사용함. 근데 굳이 필요하나. 없어도 크게 문제있진 않음.

    this.savedRgb = 0xf3316e; //초기 색상
    this.rgb = 0xf3316e; //색상
  }

  collide() {
    this.rgb = 0x451966; //충돌시 색상 연산을 하기 위해 색상을 이렇게 정했다.
  }

  draw() {
    this.rgb += (this.savedRgb - this.rgb) * COLOR_SPEED; //초기 rgb에서 현재 색상을 뺀만큼 COLOR_SPEED곱하여 현재 rgb에 더한다.
    //COLOR_SPEED에 따라서 색상이 변경되는 속도가 달라진다.
    this.x += (this.savedX - this.x) * MOVE_SPEED; //초기 x 값에서 현재의 x값을 빼고 속력만큼 곱하여 현재 x값에 더해준다.
    this.y += (this.savedY - this.y) * MOVE_SPEED; //위와 동일, 멀면 멀수록 빠르게 복귀가 된다.
    //조금씩 원래 위치를 찾아가는 식인데 MOVE_SPEED를 곱하여 속력을 조정할 수 있다.MOVE_SPEED 계수를 조절하여 입자의 운동을 자연스럽게 맞춘다.
    this.vx *= FRICTION; //속도에 마찰정도를 곱한다. 마찰계수의 값이 1보다 작기 때문에 속도는 항상 줄어든다. 근데 속도가 0인데..?
    this.vy *= FRICTION; //속도가 줄어들지 않으면 입자가 날아다닌다.
    //friction이 1이면 입자가 움직이지 않는다. 너무 작으면 입자들이 퍼지지 않는다. 1보다 크면 밖으로 퍼진다.
    //위의 식과 밑의 식이 평형을 이루면 입자가 멈춰있고, 평형이 깨지면 입자가 움직인다.
    //이 결과값이 다시 여기 들어와서 반복되는 것이기 때문에 평형을 이루거나 움직일 수 있다.
    this.x += this.vx; //현재 입자의 x좌표에 속도를 더한다.
    this.y += this.vy; //위와 동일
    //위 식은 입자가 마우스와 부딪혔을 때 입자가 vx,vy만큼 움직이는 것을 의미한다. vx,vy는 x와 y의 변화량이다. 속도 맞다. 그래서 원점에서 멀어질수록 ax,ay를 계속 더해주기 때문에
    this.sprite.x = this.x; //변경한 x좌표를 실질적인 텍스쳐값에 대입한다.
    this.sprite.y = this.y; //위와 동일
    this.sprite.tint = this.rgb; //색도 대입한다.
  }
}
