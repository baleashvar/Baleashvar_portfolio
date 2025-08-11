uniform float time;
uniform vec3 color;
uniform float opacity;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vec2 uv = vUv;
  
  // Scanlines
  float scanline = sin(uv.y * 800.0 + time * 10.0) * 0.04;
  
  // Glitch effect
  float glitch = step(0.98, sin(time * 50.0)) * 0.1;
  uv.x += glitch * (sin(time * 100.0) * 0.01);
  
  // Fresnel
  vec3 viewDirection = normalize(cameraPosition - vPosition);
  float fresnel = 1.0 - dot(vNormal, viewDirection);
  fresnel = pow(fresnel, 2.0);
  
  // Final color
  vec3 finalColor = color + scanline;
  float alpha = opacity * fresnel;
  
  gl_FragColor = vec4(finalColor, alpha);
}