import { Tool } from "../components/Toolbar";
import { getExistingShapes } from "./http";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      startX: number;
      startY: number;
      endX: number;
      endY: number;
    };

type ShapeWithId = {
  shape: Shape;
  messageId: number;
};

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private existingShapes: ShapeWithId[];
  private roomId: string;
  private socket: WebSocket;
  private clicked: boolean;
  private startX = 0;
  private startY = 0;
  private selectedTool: Tool = "rect";
  private pencilPath: { x: number; y: number }[] = [];
  private lastX = 0;
  private lastY = 0;

  constructor(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.existingShapes = [];
    this.roomId = roomId;
    this.socket = socket;
    this.clicked = false;
    this.init();
    this.initHandlers();
    this.initMouseHandlers();
  }
  destroy() {
    // Clean up event listeners
    this.canvas.removeEventListener("mousedown", this.mouseDownHandler);
    this.canvas.removeEventListener("mouseup", this.mouseUpHandler);
    this.canvas.removeEventListener("mousemove", this.mouseMoveHandler);
  }

  setTool(tool: "rect" | "circle" | "line" | "eraser" | "select") {
    this.selectedTool = tool;
  }


  async init() {
    this.existingShapes = await getExistingShapes(this.roomId);
    this.clearCanvas();
  }

  initHandlers() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "chat") {
        const parsedMessage = JSON.parse(message.message);
        
        if (parsedMessage.shape && parsedMessage.shape.type) {
          // Handle new shape - validate shape before adding
          // Note: New shapes from WebSocket won't have messageId initially
          // They'll get proper IDs when fetched from database
          this.existingShapes.push({
            shape: parsedMessage.shape,
            messageId: -1 // Temporary ID for new shapes
          });
          this.clearCanvas();
        }
      }
    };
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = "rgba(0,0,0)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Filter out invalid shapes and render valid ones
    this.existingShapes = this.existingShapes.filter(shapeWithId => shapeWithId && shapeWithId.shape && shapeWithId.shape.type);
    
    this.existingShapes.forEach((shapeWithId) => {
      if (!shapeWithId || !shapeWithId.shape || !shapeWithId.shape.type) return; // Skip invalid shapes
      
      const shape = shapeWithId.shape;
      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;

      if (shape.type === "rect") {
        this.ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      } else if (shape.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(
          shape.centerX,
          shape.centerY,
          shape.radius,
          0,
          2 * Math.PI,
        );
        this.ctx.stroke();
      } else if (shape.type === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(shape.startX, shape.startY);
        this.ctx.lineTo(shape.endX, shape.endY);
        this.ctx.stroke();
      }
    });
  }
  mouseDownHandler = (e: MouseEvent) => {
    this.clicked = true;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.pencilPath = [{ x: this.lastX, y: this.lastY }];
  };

  mouseUpHandler = (e: MouseEvent) => {
    this.clicked = false;

    //@ts-ignore
    const selectedTool = this.selectedTool;

    // Skip eraser tool for now
    if (selectedTool === "eraser") {
      return;
    }

    const width = e.clientX - this.startX;
    const height = e.clientY - this.startY;

    let shape: Shape | null = null;
    if (selectedTool === "rect") {
      shape = {
        type: "rect",
        x: this.startX,
        y: this.startY,
        height,
        width,
      };
    } else if (selectedTool === "circle") {
      const centerX = this.startX + width / 2;
      const centerY = this.startY + height / 2;
      const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
      shape = {
        type: "circle",
        centerX,
        centerY,
        radius,
      };
    } else if (selectedTool === "line") {
      shape = {
        type: "line",
        startX: this.startX,
        startY: this.startY,
        endX: e.clientX,
        endY: e.clientY,
      };
    }
    if (!shape) {
      return;
    }

    this.existingShapes.push({
      shape,
      messageId: -1 // Temporary ID for new shapes
    });
    
    
    this.socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify({
          shape,
        }),
        roomId: this.roomId,
      }),
    );
  };

  mouseMoveHandler = (e: MouseEvent) => {
    //@ts-ignore
    const selectedTool = this.selectedTool;
    
    // Update cursor based on selected tool
    if (selectedTool === "eraser") {
      this.canvas.style.cursor = "crosshair";
    } else {
      this.canvas.style.cursor = "default";
    }

    if (this.clicked) {
      // Skip eraser tool for now
      if (selectedTool === "eraser") {
        return;
      }

      const width = e.clientX - this.startX;
      const height = e.clientY - this.startY;
      this.clearCanvas();

      this.ctx.strokeStyle = "white";
      this.ctx.lineWidth = 2;

      if (selectedTool === "rect") {
        this.ctx.strokeRect(this.startX, this.startY, width, height);
      } else if (selectedTool === "circle") {
        const centerX = this.startX + width / 2;
        const centerY = this.startY + height / 2;
        const radius = Math.max(Math.abs(width), Math.abs(height)) / 2;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
      } else if (selectedTool === "line") {
        this.ctx.beginPath();
        this.ctx.moveTo(this.startX, this.startY);
        this.ctx.lineTo(e.clientX, e.clientY);
        this.ctx.stroke();
      }
    }
  };


  initMouseHandlers() {
    this.canvas.addEventListener("mousedown", this.mouseDownHandler);
    this.canvas.addEventListener("mouseup", this.mouseUpHandler);
    this.canvas.addEventListener("mousemove", this.mouseMoveHandler);
  }


}
