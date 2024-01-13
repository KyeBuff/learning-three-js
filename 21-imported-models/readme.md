# Notes

https://threejs-journey.com/lessons/imported-models

## Formats

Most popular and becoming a standard is glTF, examples found in static folder.

Is a standard being maintained by WebGL and important members such as Google etc

Contains a mini scene (or even multiple scenes) inside the file, camera, animations, lights etc and when imported all can be accessed.

Many formats though and each use case is different. glTF can be overkill and other formats may be more appropriate including a custom format created by yourself.

Some can have all data and some little but improves performance.

## Optimisations
- glTF unoptimised can be quite heavy but gives full access to editing the asset in THREE or in another software, imports referenced assets such as texture etc
    - Contains the geom, UV coords, normals inside of the binary file
- glTF binary is very hard to edit but comes a single file which can be imported with less weight
- Draco compresses the buffer (geom) data inside of the JSON file with significant reductions
- Embedded (not many use cases) - embeds assets (textures etc) within it

## Import best practices
- Investigate scale and position of the object3d in the scene 
    - If values are applied, bear in mind that the object3d is a wrapper to children and the scale etc affects them
    - Therefore if you import the mesh directly as a child, it will scale up and look huge
- You can import the Mesh directly but requires traversal and lead to messy code
- You can edit the glTF and re-export as per what you need (scale on mesh not object3d parent)

Adding scene children removed them fro model object

Draco compression
Compresses the geometry buffer data.
Requires a draco loader in THREE.JS and a decoder (which is a folder in the THREEJS)

This Draco folder is located in /node_modules/three/examples/jsm/libs/. Take the whole /draco/ folder and copy it into your /static/ folder. We can now provide the path to this folder to our dracoLoader:

dracoLoader.setDecoderPath('/draco/')

gltfLoader.setDRACOLoader(dracoLoader)

Animations
Come along in the gltf animations proeprty as an array of animations

Requires a AnimatonMixer which can play the animation - this takes the gltf scene as the argument

The mixer needs you to create an AnimationClip - mixer.clipAction() - this fn takes the animation as it's argument

Clip actions returns an action where you can call .play()

The last step is to mixer.update() in the tick function

THREEJS Editor basic editor, based on THREEJS - https://threejs.org/editor/
Good for testing imported models