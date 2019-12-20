const tex_loader = new THREE.TextureLoader();

const tex_cache = {};

export function getTexture(path, onLoad, onProgress, onError) {
  if (!path) {
    // console.log('invalid path');
    return;
  }
  
  // make this work with an array of paths as well
  if (Array.isArray(path)) {
    return path.map(getTexture);
  }
  
  if (!tex_cache[path]) {
    
    // console.log('LOADING texture: ', path);
    
    let cached = {
      texture: null,
      textureRotated: null,
      loadPromise: null,
    };
    
    cached.loadPromise = Promise.all([
      new Promise((resolve, reject) => {
        cached.texture = tex_loader.load(path, resolve, onProgress, reject);
      }),
      new Promise((resolve, reject) => {
        cached.textureRotated = tex_loader.load(path, resolve, onProgress, reject);
        cached.textureRotated.rotation = 1.57;
      }),
    ]);
    
    cached.loadPromise.then(() => {
      if (onLoad instanceof Function) onLoad(cached.texture, cached.textureRotated);
    }, onError); // don't chain with previous call!
    
    tex_cache[path] = cached;
    
    return cached.texture;
    
  } else {
    
    // console.log('GOT cached texture: ', path);
    
    let cached = tex_cache[path];
    
    cached.loadPromise.then(() => {
      if (onLoad instanceof Function) onLoad(cached.texture, cached.textureRotated);
    }, onError);
    
    return cached.texture;
    
  }
}




const obj_loader = new THREE.OBJLoader();

const obj_cache = {};

export function getOBJ(path, onLoad, onProgress, onError) {
  if (!path) {
    // console.log('invalid path');
    return;
  }
  
  // make this work with an array of paths as well
  if (Array.isArray(path)) {
    return path.map(getTexture);
  }
  
  if (!obj_cache[path]) {
    
    // console.log('LOADING OBJ: ', path);
    
    let cached = {
      obj: null,
      loadPromise: null,
    };
    
    cached.loadPromise = new Promise((resolve, reject) => {
      cached.obj = obj_loader.load(path, resolve, onProgress, reject);
    });
    
    cached.loadPromise.then(onLoad, onError); // don't chain with previous call!
    
    obj_cache[path] = cached;
    
    return cached.obj;
    
  } else {
    
    // console.log('GOT cached OBJ: ', path);
    
    let cached = obj_cache[path];
    
    cached.loadPromise.then(onLoad, onError);
    
    return cached.obj;
    
  }
}
