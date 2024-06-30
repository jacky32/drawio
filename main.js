function Rectangle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

const calculateRectangle = () => {
  let mainWidth = parseFloat(document.querySelector("#mainWidth").value);
  let mainHeight = parseFloat(document.querySelector("#mainHeight").value);
  let newWidth = parseFloat(document.querySelector("#newWidth").value);
  let newHeight = parseFloat(document.querySelector("#newHeight").value);
  let gap = parseFloat(document.querySelector("#gap").value);
  let rectangles = Array.from(document.querySelectorAll(".rectangle")).map(
    (rectangle) => {
      const width = parseFloat(rectangle.querySelector(".width").value);
      const height = parseFloat(rectangle.querySelector(".height").value);
      return { width, height };
    }
  );

  if (mainWidth > 0 && mainHeight > 0 && newHeight > 0 && newWidth > 0) {
    const canvas = document.getElementById("myCanvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    let scale = canvas.width / mainWidth;
    if (canvas.height / mainHeight < scale) scale = canvas.height / mainHeight;
    let rectangleOuter = new Rectangle(0, 0, mainWidth, mainHeight);
    drawRectangle(context, scale, rectangleOuter, "yellow", 2, "black", "");

    if (!(newWidth + gap < mainWidth && newHeight + gap < mainHeight))
      alert("Check values! Dimensions can not be 0.");

    let maxPosX = 0;
    let maxPosY = 0;
    let recArray = [];
    let posX = 0 + gap;
    let posY = 0 + gap;
    let row = 1;
    console.log("----");

    rectangles.forEach((rectangle, index) => {
      const conditionWidth = () => maxPosX + rectangle.width + gap < mainWidth;
      const conditionHeight = () =>
        maxPosY + rectangle.height + gap < mainHeight;
      const conditionNextWidth = () =>
        maxPosX + rectangles[index + 1]?.width + gap < mainWidth;
      console.log({
        index,
        posX,
        posY,
        maxPosX,
        maxPosY,
        mainWidth,
        gap,
        mainHeight,
        width: rectangle.width,
        height: rectangle.height,
        scale,
        conditionWidth: conditionWidth(),
        conditionHeight: conditionHeight(),
        conditionNextWidth: conditionNextWidth(),
        nextWidth: rectangles[index + 1]?.width,
        row,
      });

      const updatePos = (pos = "both", size = "default") => {
        if (pos === "x") {
          if (size === "default") size = posX + rectangle.width;
          posX = Math.round((size + gap) * 1000) / 1000;
          maxPosX = posX;
        } else if (pos === "y") {
          if (size === "default") size = posY + rectangle.height;
          posY = Math.round((size + gap) * 1000) / 1000;
          maxPosY = posY;
        } else if (pos === "both") {
          updatePos("x", size);
          updatePos("y", size);
        }
      };

      if (conditionWidth() && conditionHeight()) {
        // updatePos("y", 0);
        let rec = new Rectangle(posX, posY, rectangle.width, rectangle.height);
        recArray.push(rec);
        updatePos("x");
        if (!conditionNextWidth()) {
          // updatePos(
          //   "y",
          //   (Math.round((rectangle.height + gap) * 1000) / 1000) * row
          // );
        }
      } else if (conditionHeight()) {
        row += 1;
        // if (posY == gap) {
        //   console.log("updated");
        updatePos("y");
        updatePos("x", 0);
        console.log(conditionHeight());
        if (!conditionHeight()) {
          alert("Nevejde se");
          deleteLastRectangle();
          return;
        }
        // }
        let rec = new Rectangle(posX, posY, rectangle.width, rectangle.height);
        recArray.push(rec);
        updatePos("x");
        // updatePos("y");
      } else {
        alert("Nevejde se");
        deleteLastRectangle();
      }
      console.log({
        index,
        posX,
        posY,
        maxPosX,
        gap,
        maxPosY,
        mainWidth,
        mainHeight,
        width: rectangle.width,
        height: rectangle.height,
        scale,
        conditionWidth: conditionWidth(),
        conditionHeight: conditionHeight(),
        conditionNextWidth: conditionNextWidth(),
        nextWidth: rectangles[index + 1]?.width,
        row,
      });
    });
    for (let i = 0; i < recArray.length; i++) {
      drawRectangle(context, scale, recArray[i], "white", 1, " #21618c ", i);
    }
  }
  function drawRectangle(
    context,
    scale,
    rectangle,
    color,
    width,
    colorStroke,
    number
  ) {
    context.beginPath();
    context.rect(
      rectangle.x * scale,
      rectangle.y * scale,
      rectangle.width * scale,
      rectangle.height * scale
    );

    context.fillStyle = color;
    context.fill();
    context.lineWidth = width;
    context.strokeStyle = colorStroke;
    context.stroke();
    context.fillStyle = "red";
    context.font = "16px Arial";
    context.fillText(
      number,
      rectangle.x * scale + (rectangle.width * scale) / 2 - 5,
      rectangle.y * scale + (rectangle.height * scale) / 2
    );
  }
};

const setSize = () => {
  const mainWidth = document.querySelector("#mainWidth").value * 1;
  const mainHeight = document.querySelector("#mainHeight").value * 1;
  document.querySelector("#mainWidth").value = mainWidth;
  document.querySelector("#mainHeight").value = mainHeight;
  const canvas = document.querySelector("#myCanvas");
  canvas.width = mainWidth * 3;
  canvas.height = mainHeight * 3;
  calculateRectangle();
};

const addRectangle = () => {
  const newWidth = document.querySelector("#newWidth").value * 1;
  const newHeight = document.querySelector("#newHeight").value * 1;
  document.querySelector("#newWidth").value = newWidth;
  document.querySelector("#newHeight").value = newHeight;

  // Update html rectangles
  const rectangles = document.querySelector("#rectangles");
  const rectangleCount = document.querySelectorAll(".rectangle").length;
  const rectangle = document.createElement("div");
  rectangle.classList.add("rectangle");
  const span = document.createElement("span");
  span.textContent = rectangleCount;
  rectangle.appendChild(span);
  const form = document.createElement("form");

  // width
  const labelWidth = document.createElement("label");
  const inputWidth = document.createElement("input");
  inputWidth.setAttribute("type", "number");
  inputWidth.setAttribute("value", newWidth);
  inputWidth.setAttribute("id", "width" + rectangleCount);
  inputWidth.classList.add("width");
  labelWidth.appendChild(inputWidth);
  const emWidth = document.createElement("em");
  emWidth.textContent = "šířka";
  labelWidth.appendChild(emWidth);
  form.appendChild(labelWidth);

  // height
  const labelHeight = document.createElement("label");
  const inputHeight = document.createElement("input");
  inputHeight.setAttribute("type", "number");
  inputHeight.setAttribute("value", newHeight);
  inputHeight.setAttribute("id", "height" + rectangleCount);
  inputHeight.classList.add("height");
  labelHeight.appendChild(inputHeight);
  const emHeight = document.createElement("em");
  emHeight.textContent = "výška";
  labelHeight.appendChild(emHeight);
  form.appendChild(labelHeight);

  // input update
  const inputUpdate = document.createElement("input");
  inputUpdate.setAttribute("type", "button");
  inputUpdate.setAttribute("value", "aktualizovat");
  inputUpdate.setAttribute("id", "update" + rectangleCount);
  form.appendChild(inputUpdate);

  // input delete
  const inputDelete = document.createElement("input");
  inputDelete.setAttribute("type", "button");
  inputDelete.setAttribute("value", "smazat");
  inputDelete.setAttribute("id", "delete" + rectangleCount);
  form.appendChild(inputDelete);

  rectangle.appendChild(form);
  const br = document.createElement("br");
  rectangle.appendChild(br);
  rectangles.appendChild(rectangle);

  inputUpdate.addEventListener("click", () => calculateRectangle());
  inputDelete.addEventListener("click", () => deleteRectangle(rectangleCount));

  calculateRectangle();
};

const deleteRectangle = (id) => {
  const rectangle = Array.from(document.querySelectorAll(".rectangle"))[id];
  rectangle.remove();
  calculateRectangle();
};

const deleteLastRectangle = () => {
  const rectangles = Array.from(document.querySelectorAll(".rectangle"));
  rectangles[rectangles.length - 1].remove();
  calculateRectangle();
};

document.addEventListener("DOMContentLoaded", () => calculateRectangle());

// document
//   .querySelector("#calculateRectangle")
//   .addEventListener("click", () => calculateRectangle());

document.querySelector("#setSize").addEventListener("click", () => setSize());

document
  .querySelector("#newRectangle")
  .addEventListener("click", () => addRectangle());

setSize();
