import { Component } from "~/test/components/Component";
import { Header } from "~/test/components/Header";
import { Sidebar } from "~/test/components/Sidebar";

export function TestApp() {
  return (
    <div
      class="grid h-screen w-screen"
      style={{
        "grid-template-columns": "auto 1fr",
        "grid-template-rows": "auto 1fr",
        "grid-template-areas": `
          "head head"
          "side main"
        `,
      }}
    >
      <div style={{ "grid-area": "head" }}>
        <Header />
      </div>
      <div style={{ "grid-area": "side" }}>
        <Sidebar />
      </div>
      <div style={{ "grid-area": "main" }}>
        <Component />
      </div>
    </div>
  );
}
