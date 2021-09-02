/** @jsxRuntime classic /
/* @jsx jsx */
import { jsx } from "@emotion/react";
import { filterLayersByType } from "./actions/templates";

// ------------------------------- //
// ------------ files ------------ //
// ------------------------------- //
const files = [
  { file: "/me.jpg" },
  { file: "/le_cri.jpg" },
  { file: "/image1.jpg" },
  { file: "/anatomies.jpeg" }
];

// ------------------------------- //
// ------------ template --------- //
// ------------------------------- //
const template = {
  name: "template1",
  layers: [
    { id: "ui1", type: "userImage" },
    { id: "ui11", type: "userImage" }
  ]
};

// --------------------------- //
// -------- copy files ------- //
// --------------------------- //
const userImageWithFiles = [];
// get userImage layers
const userImages = filterLayersByType(template.layers, "userImage");
for (let i = 0; i < userImages.length; i++) {
  userImageWithFiles[i] = [...files];
}

// --------------------------- //
// ------------ pack --------- //
// --------------------------- //
// each pack should have a template => 4p x 1t x2l
const packTemplates = [];
const packNumber = 4;
new Array(packNumber).fill(0).forEach((_, index) => {
  // 1t
  const newTemplate = {
    ...template
    // 2l
    // layers: bindFilesToLayers(template, userImageWithFiles.flat(), index),
  };
  packTemplates.push(newTemplate);
});

console.log(packTemplates);

const Test = () => {
  return <div className="flexCenter">text</div>;
};

export default Test;
