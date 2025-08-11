uniform float time;
uniform float intensity;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normal;
  
  vec3 pos = position;
  float wave = sin(pos.y * 10.0 + time * 2.0) * 0.1 * intensity;
  pos.x += wave;
  pos.z += wave * 0.5;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}