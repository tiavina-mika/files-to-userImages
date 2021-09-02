export const updateLayersValue = (id, value, field = "text") => (layer) => {
  if (layer.id === id) {
    layer[field] = value;
  } else if (layer.layers) {
    layer.layers.forEach(updateLayersValue(id, value, field));
  }
};

/**
 * test if the template has a text layer
 * @param {*} layers
 * @returns
 */
export const hasTextLayer = (layers) => {
  const userTextLayer = layers.find((layer) => layer.type === "userText");
  const userTextSubLayer = layers.find((layer) => {
    return layer.layers && hasTextLayer(layer.layers);
  });

  return userTextLayer || userTextSubLayer;
};

/**
 * get only certain layer type
 * @param {*} layers
 * @param {*} filter
 * @returns
 */
export const filterLayersByType = (layers, filter = "userImage") => {
  const userImageLayers = [];
  const setFilter = (layer) => {
    if (typeof filter === "string") {
      return layer.type === filter;
    }
    return layer.type === filter[0] || layer.type === filter[1];
  };
  for (const layer of layers) {
    if (setFilter(layer)) {
      userImageLayers.push(layer);
    } else if (layer.type === "mask" && layer.layers) {
      const userImageSubLayers = [];
      for (const subLayer of layer.layers) {
        if (setFilter(subLayer)) {
          userImageSubLayers.push(subLayer);
        }
      }
      userImageLayers.push(...userImageSubLayers);
    }
  }

  return userImageLayers;
};

/**
 * insert the uploaded image file to the template layers
 * @param {*} template
 * @returns
 */
export const addUploadImagesToTemplateLayers = (template, files) => {
  const newTemplateLayers = template.layers.map((layer) => {
    const newLayer = { ...layer };
    const userImageLayers = filterLayersByType(template.layers);

    if (layer.type === "userImage") {
      const fileIndex = userImageLayers.findIndex(
        (userImageLayer) => userImageLayer.id === layer.id
      );

      newLayer.file = files[fileIndex];
    } else if (layer.type === "mask" && layer.layers) {
      const newSubLayers = layer.layers.map((subLayer) => {
        const newSubLayer = { ...subLayer };
        if (subLayer.type === "userImage") {
          const fileIndex = userImageLayers.findIndex(
            (userImageLayer) => userImageLayer.id === subLayer.id
          );

          newSubLayer.file = files[fileIndex];
        }

        return newSubLayer;
      });
      newLayer.layers = newSubLayers;
    }

    return newLayer;
  });

  const newTemplate = { ...template, layers: newTemplateLayers };
  return newTemplate;
};

const bindFilesToLayers = (template, files) => {
  const userImages = filterLayersByType(template.layers, "userImage");
  const formattedLayers = [];

  files.forEach((file, index) => {
    // let montageLayer = montageLayerById.get(layer.id);
    userImages[index].file = file;
  });

  const userImageLayerById = new Map();
  userImages.forEach((layer) => {
    userImageLayerById.set(layer.id, layer);
  });
  const newLayers = [];
  for (const layer of template.layers) {
    // if (layer.type === 'userImage') {
    //   const uiLayer = userImageLayerById.get(layer.id);
    //   newLayers.push(uiLayer);
    // } else
    if (layer.type === "mask") {
      let newSubLayers;
      for (const subLayer of layer.layers) {
        if (subLayer.type === "userImage") {
          const uiLayer = userImageLayerById.get(subLayer.id);
          const maskSubLayers = {
            ...layer,
            layers: [
              ...layer.layers.filter((l) => l.id !== uiLayer.id),
              uiLayer
            ]
          };
          newSubLayers = maskSubLayers;
          // newSubLayers.push(maskSubLayers);
        }
      }
      newLayers.push(newSubLayers);
    }
    // else {
    //   newLayers.push(layer);
    // }
  }
  return newLayers;
};
