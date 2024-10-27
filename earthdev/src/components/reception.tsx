import classes from "@/components/classes.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";

export function Reception() {
  const [exportP2P, setExportP2P] = useState("");
  const [exportTime, setExportTime] = useState("");
  const [exportJma, setExportJma] = useState("");
  const [exportSite, setExportSite] = useState("");
  // 値をセッションストレージに保存する関数
  const saveToSessionStorage = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
  };

  // 状態が変わるたびにセッションストレージに保存する
  useEffect(() => {
    if (exportP2P) saveToSessionStorage("ExportP2P", exportP2P);
  }, [exportP2P]);

  useEffect(() => {
    if (exportTime) saveToSessionStorage("ExportTime", exportTime);
  }, [exportTime]);

  useEffect(() => {
    if (exportJma) saveToSessionStorage("ExportJma", exportJma);
  }, [exportJma]);
  useEffect(() => {
    if (exportSite) saveToSessionStorage("ExportSite", exportSite);
  }, [exportSite]);

  //"setExportP2P"→"ExportP2P"
  //"setExportTime"→"ExportTime"
  //"setExportJma"→"ExportJma"

  useEffect(() => {
    const startup = () => {
      console.log("Startup関数が実行されました");
    };
    startup();
    getData();
    getTime();
    getSite();
  }, []);
  async function reception() {
    alert("受信しました。!");
    getData();
    getTime();
    getSite();
  }
  function getSite() {
    setExportSite("🟡実装中")
    // earthquake側のapiから持ってくる予定
  }

  function getTime() {
    const now = new Date();
    const jpTime = now.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    console.log("日本時間:", jpTime);
    setExportTime(jpTime);
  }
  async function getData() {
    //apiに受信しに行く
    const APIP2P = new WebSocket("wss://api.p2pquake.net/v2/ws");

    APIP2P.onopen = function (event) {
      console.log("🟢OK");
      setExportP2P("🟢OK"); // 接続成功時に状態を更新
    };

    APIP2P.onclose = function (event) {
      console.log("🔴" + event.code);
      setExportP2P("🔴" + event.code); // 終了時に状態を更新
    };

    const APIJMA = await fetch(
      "https://www.jma.go.jp/bosai/forecast/data/forecast/130000.json"
    );
    if (APIJMA.ok) {
      console.log("🟢OK");
      setExportJma("🟢OK");
    } else {
      console.log("🔴" + APIJMA.status);
      setExportJma("🔴" + APIJMA.status);
    }
  }

  return (
    <div>
      <main className="font-mono">
        <code>
          <br />
          JMA-API {exportJma}
          <br />
          P2P-API {exportP2P}
          <br />
          Earthsite  {exportSite} 
          <br />
          取得時間 {exportTime}
          <br />
        </code>
        <button className={classes.button} onClick={reception}>
          受信
        </button>
      </main>
    </div>
  );
}
