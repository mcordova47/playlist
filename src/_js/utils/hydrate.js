import React from "react";
import { createRoot } from "react-dom/client";


/** Creates a `hydrate` function which can be exported from an entrypoint */
export const hydrateFn = component => (id, props) => {
  const el = document.getElementById(id);
  createRoot(el).render(React.createElement(component, props));
}
