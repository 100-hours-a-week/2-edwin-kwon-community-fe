import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import timeout from "connect-timeout";
import helmet from "helmet";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet());

// helmet의 CSP 상세 설정
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // 기본적으로 같은 출처의 리소스만 허용
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // 스크립트 소스 제한
      styleSrc: ["'self'", "'unsafe-inline'"], // 스타일 소스 제한
      imgSrc: ["'self'", "data:", "https:"], // 이미지 소스 제한
      connectSrc: ["'self'"], // AJAX, WebSocket 등의 연결 제한
      fontSrc: ["'self'"], // 폰트 소스 제한
      objectSrc: ["'none'"], // <object>, <embed>, <applet> 태그 제한
      mediaSrc: ["'self'"], // 비디오와 오디오 제한
      frameSrc: ["'none'"], // 프레임 제한
    },
  }),
);

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// rate-limit 미들웨어 설정
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15분
    limit: 15, // IP당 15회 -> 근데 실제로 왜 8번 때 제한?
    message: "Too many requests from this IP, please try again later",
    standardHeaders: true, // RateLimit-* 헤더 포함
    legacyHeaders: false, // X-RateLimit-* 헤더 비활성화
  }),
);

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname));

app.use(timeout("3s"));
app.use((req, res, next) => {
  console.log("이벤트 리스너 등록");
  req.on("timeout", () => {
    console.log("타임아웃 이벤트 발생");
    res.status(408).send("Timeout from event listener");
  });
  next();
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/slow", (req, res) => {
  setTimeout(() => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  }, 4000); // 4초 지연
});

app.post("/test", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "post ok",
    data: req.body,
  });
});

app.put("/test", (req, res) => {
  return res.status(201).json({
    status: 201,
    message: "put ok",
    data: req.body,
  });
});

app.patch("/test", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "patch ok",
    data: req.body,
  });
});

app.delete("/test", (req, res) => {
  return res.status(204).end();
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
