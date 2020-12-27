export class Text {
  //텍스트라는 클레스를 만든다. export를 사용하여 외부에서도 쓸 수 있도록 한다.
  constructor() {
    //constructor class의 기본 요소. 기본적인 데이터 및 메소드가 포함된다.
    this.canvas = document.createElement("canvas"); //캔버스를 만든다. 말그대로 만들기만 한다. //위쪽여백 0
    /* this.canvas.style.position = "absolute";//위치가 절대적이다. 그니까 아무런것의 영향을 받지 않는다. 
    this.canvas.style.left = "0";// 왼쪽 여백 0
    this.canvas.style.top = "0";*/ document.body.appendChild(
      this.canvas
    ); //body테그의 자식태그로 canvas를 마지막에 삽입한다.

    this.ctx = this.canvas.getContext("2d"); //나는 이제 캔버스에 2d그림을 그릴 것이다.
  }
  setText(str, density, stageWidth, stageHeight) {
    //텍스트를 세팅하는 메소드, 어떤 텍스트를 쓸지, 글씨의 밀도, 텍스트가 쓰여질 스테이지의 너비와 높이가 매개변수로 들어간다. 밀도가 들어간 이유는 점들의 밀도가 있기 떄문이다.
    this.canvas.width = stageWidth; //캔버스의 width 값을 stageWidth로 한다.
    this.canvas.height = stageHeight; //캔버스의 height값을 stageHeight로 한다. 참고로 현재 캔버스는 document.createElement("canvas");로 생성된 캔버스이다.

    const myText = str; //myText라는 변수에 내가 입력한 문자가 들어간다
    const fontWidth = 700; //문자의 너비라기보단 굵기, weight를 나타낸다.
    const fontSize = 800; //문자의 크기 나중에 픽셀로 나타낸다
    const fontName = "Hind"; // 문자의 이름, 매개 변수들을 다 const안으로 넣어서 변하지 않게 한다.

    this.ctx.clearRect(0, 0, stageWidth, stageHeight); //캔버스가 그려질 공간을 비운다.
    this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`; //글씨체 굵기, 사이즈, 폰트 이름 순으로 적어준다.
    this.ctx.fillStyle = `rgba(0,0,0,0.3)`; //fillStyle값은 rgb,rgba, 16비트 색상이 들어간다.
    this.ctx.textBaseline = `middle`; //베이스라인을 middle로 한다. 다른 것도 많다.
    const fontPos = this.ctx.measureText(myText); //TextMerics를 리턴한다. TextMerics는 텍스트의 폭, 위치 등등 여러값이 포함되어 있는 객체이다.
    this.ctx.fillText(
      //텍스트를 그린다. font, TextAlign,textBaseline, direction 정보를 바탕으로 텍스트를 그린다.
      myText, //텍스트가 들어간다.
      (stageWidth - fontPos.width) / 2, //텍스트의 x 좌표, 캔버스에서 텍스트를 뺀 값의 반, 정중앙이라 보면 된다.
      fontPos.actualBoundingBoxAscent + //actualBoundingBoxAscent는 textMetrix의 요소로서 베이스 라인을 기준으로 Boundingbox 위쪽 부분을 나타낸다.
        fontPos.actualBoundingBoxDescent + //actualBoundingBoxDescent는 actualBoundingBoxAscent와 다르게 아래 부분을 나타낸다.
        (stageHeight - fontSize) / 2 //폰트를 가운데 정렬하기 위해 이렇게 한다. 오리진이 Boundingbox왼쪽 위가 아니라 Baseline에 위치해있기 때문에 가운데 정렬하기 위해 이렇게 한다.
    );

    return this.dotPos(density, stageWidth, stageHeight); //리턴 값으로 dotPos함수를 실행 시킨다.
  }

  dotPos(density, stageWidth, stageHeight) {
    //함수를 정의한다. 매개변수로는 밀도, 캔버스 가로, 세로 길이를 가져온다.
    const imageData = this.ctx.getImageData(0, 0, stageWidth, stageHeight).data; //getImageData는 캔버스의 픽셀 데이터를 가져온다. 이 메소드는 imagedata를 반환한다.data메소드를 통해 픽셀 데이터들을 rgba값이 들어있는 어레이로 반환한다.
    const particles = []; //입자들이 들어갈 빈 어레이다.
    let i = 0;
    let width = 0;
    let pixel;

    for (let height = 0; height < stageHeight; height += density) {
      //캔버스의 높이에 대하여 밀도만큼 더하면서 for문을 돌린다.
      ++i; //i = i+1를 반환한다. i에는 처음부터 1이 더해진다.
      const slide = i % 2 == 0; //i가 짝수인지 판별한다.
      width = 0; //width값을 초기화 시킨다.
      if (slide == 1) {
        width += 6; //왜 6일까??
      }
      for (width; width < stageWidth; width += density) {
        //캔버스의 너비에 대하여 밀도만큼 더하면서 for문을 돌린다.
        pixel = imageData[(width + height * stageWidth) * 4 - 1]; //
        if (
          pixel != 0 && //픽셀이 비어있지 않고
          width > 0 && //너비가 0보다 크고
          width < stageWidth && //너비가 캔버스 너비보다 작고
          height > 0 && //높이가 0보다 크고
          height < stageHeight //높이가 캔버스 높이보다 작으면
        ) {
          particles.push({ x: width, y: height }); //x,y좌표값을 가진 입자를 어레이에 추가한다.
        }
      }
    }
    return particles; //입자들의 좌표 정보가 들어있는 배열을 리턴한다.
  }
}
