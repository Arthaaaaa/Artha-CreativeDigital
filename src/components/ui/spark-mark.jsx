import { useEffect, useRef } from 'react'
import logo from './spark.svg'

const VERTEX = `#version 300 es
in vec2 aPosition;
void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`

const FRAGMENT = `#version 300 es
precision highp float;
#define PI 3.14159265359
uniform sampler2D uField;
uniform vec2 uFieldScale;
uniform vec2 uResolution;
uniform float uTime;
uniform vec4 uMatP[8];
uniform vec4 uMatC[16];
out vec4 outColor;
#define N_COLORS uMatP[0].x
#define P_INNER uMatP[0].y
#define P_OUTER uMatP[0].z
#define P_CONTOUR uMatP[0].w
#define P_ANGLE uMatP[1].x
#define P_SPEED uMatP[1].y
float shapeAt(vec2 q) { return texture(uField, q * uFieldScale + 0.5).r; }
float hash(vec2 p) {
  uvec2 u = floatBitsToUint(p * vec2(141421356.0, 2718281828.0));
  return float((u.x ^ u.y) * 3141592653u) / 4294967295.0;
}
float noise(vec2 p) {
  vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
float front(float a,float b,float k,float phase) {
  float e=a-mix(-.6,.6,k)+(noise(vec2(b*4.0+phase*13.7,k*3.0+phase*7.1))-.5)*.12;
  return clamp(exp(-e*e/.0256)*smoothstep(0.0,.15,k)*(1.0-smoothstep(.85,1.0,k)),0.0,1.0);
}
vec3 toLab(vec3 c) {
  float l=dot(c,vec3(.4122214708,.5363325363,.0514459929));
  float m=dot(c,vec3(.2119034982,.6806995451,.1073969566));
  float s=dot(c,vec3(.0883024619,.2817188376,.6299787005));
  l=sign(l)*pow(abs(l),1.0/3.0); m=sign(m)*pow(abs(m),1.0/3.0); s=sign(s)*pow(abs(s),1.0/3.0);
  return vec3(.2104542553*l+.7936177850*m-.0040720468*s,1.9779984951*l-2.4285922050*m+.4505937099*s,.0259040371*l+.7827717662*m-.8086757660*s);
}
vec3 fromLab(vec3 c) {
  float l=c.x+.3963377774*c.y+.2158037573*c.z, m=c.x-.1055613458*c.y-.0638541728*c.z, s=c.x-.0894841775*c.y-1.2914855480*c.z;
  l=l*l*l; m=m*m*m; s=s*s*s;
  return vec3(4.0767416621*l-3.3077115913*m+.2309699292*s,-1.2684380046*l+2.6097574011*m-.3413193965*s,-.0041960863*l-.7034186147*m+1.7076147010*s);
}
vec4 ramp(float t) {
  float n=max(N_COLORS,1.0); vec4 c0=uMatC[0]; vec3 lab=toLab(pow(c0.rgb,vec3(2.2))); float alpha=c0.a;
  for(int i=1;i<8;i++) { if(float(i)>=n) break; float a=float(i-1)/(n-1.0), b=float(i)/(n-1.0); float k=clamp((t-a)/max(b-a,1e-6),0.0,1.0); vec4 ci=uMatC[i]; float wa=alpha*(1.0-k), wb=ci.a*k; lab=(lab*wa+toLab(pow(ci.rgb,vec3(2.2)))*wb)/max(wa+wb,.001); alpha=wa+wb; }
  return vec4(pow(max(fromLab(lab),0.0),vec3(1.0/2.2)),alpha);
}
void main() {
  float unit=min(uResolution.x,uResolution.y)*.5; vec2 frag=vec2(gl_FragCoord.x,uResolution.y-gl_FragCoord.y); vec2 p=(frag-uResolution*.5)/unit; float px=1.0/unit;
  float d=shapeAt(p), aa=clamp(length(vec2(dFdx(d),dFdy(d))),px*.5,px*1.5), inside=clamp(.5-d/aa,0.0,1.0);
  float t=uTime*P_SPEED, depth=clamp(-d,0.0,.7); float f=d>0.0?d*.5:-.5*sqrt(max(depth*(1.4-depth),0.0)); vec2 rel=p*.5; float ang=P_ANGLE*PI/180.0; vec2 along=vec2(cos(ang),sin(ang)), across=vec2(-along.y,along.x); float a=dot(rel,along), b=-dot(rel,across), base=.1*t-.3;
  float inner=(.8+.8*exp(-max(-f,0.0)/.12)); inner=mix(inner,0.0,front(a,b,fract(base),1.0)); inner=mix(inner,0.0,front(a,b,fract(base+1.0/3.0),2.0)); inner=mix(inner,0.0,front(a,b,fract(base+2.0/3.0),3.0)); inner= min(inner*2.0*P_INNER+P_CONTOUR*2.0*exp(-abs(f)/.03),1.0)*inside; inner=pow(max(inner,0.0),1.2);
  float reach=.05+.15*P_OUTER, outerBlur=exp(-max(f,0.0)/reach);
  if(d>0.0) { float r=reach*1.2,k=.5/reach; outerBlur=(outerBlur+exp(-max(shapeAt(p+vec2(r,0)),0.0)*k)+exp(-max(shapeAt(p-vec2(r,0)),0.0)*k)+exp(-max(shapeAt(p+vec2(0,r)),0.0)*k)+exp(-max(shapeAt(p-vec2(0,r)),0.0)*k))*.2; }
  float edge=smoothstep(-.06,.1,frag.x/uResolution.x)*(1.0-smoothstep(.9,1.06,frag.x/uResolution.x))*smoothstep(-.06,.1,frag.y/uResolution.y)*(1.0-smoothstep(.9,1.06,frag.y/uResolution.y));
  float sweep=fract(base*3.0-.1), y=fract(a*1.2-sweep), mask=.5+smoothstep(.3,.65,y)*(1.0-smoothstep(.65,1.0,y)); float outer=.9*pow(outerBlur,.8)*mask*5.0*P_OUTER*P_OUTER*(1.0-inside)*edge;
  float heat=clamp(inner+outer+.005*(hash(frag*vec2(1.7,1.3))-.5),0.0,1.0); vec4 c=ramp(heat); float cover=clamp(inside+outer,0.0,1.0); outColor=vec4(c.rgb*cover,c.a*cover);
}`

const hexRgba = value => {
  const hex = String(value || '#fff').slice(1)
  const full = hex.length === 3 ? hex.split('').map(char => char + char).join('') : hex
  return [0, 2, 4].map(index => parseInt(full.slice(index, index + 2), 16) / 255).concat(full.length >= 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1)
}

function loadField(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const ratio = image.width / image.height || 1
      const width = Math.round(ratio >= 1 ? 640 : 640 * ratio)
      const height = Math.round(ratio >= 1 ? 640 / ratio : 640)
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return reject(new Error('2D canvas unavailable'))
      ctx.drawImage(image, 0, 0, width, height)
      const pixels = ctx.getImageData(0, 0, width, height).data
      const size = width * height, outside = new Float64Array(size), inside = new Float64Array(size)
      for (let i = 0; i < size; i++) {
        const alpha = pixels[i * 4 + 3] / 255
        outside[i] = alpha > .5 ? 0 : 1e20
        inside[i] = alpha > .5 ? 1e20 : 0
      }
      const transform = (grid, w, h) => {
        const f = new Float64Array(Math.max(w, h)), v = new Int32Array(f.length), z = new Float64Array(f.length + 1)
        const solve = (offset, stride, length) => {
          for (let i = 0; i < length; i++) f[i] = grid[offset + i * stride]
          let k = 0; v[0] = 0; z[0] = -1e20; z[1] = 1e20
          for (let q = 1; q < length; q++) {
            let s = (f[q] + q*q - (f[v[k]] + v[k]*v[k])) / (2*q - 2*v[k])
            while (s <= z[k] && k > 0) { k--; s = (f[q] + q*q - (f[v[k]] + v[k]*v[k])) / (2*q - 2*v[k]) }
            k++; v[k] = q; z[k] = s; z[k+1] = 1e20
          }
          k = 0
          for (let q = 0; q < length; q++) { while (z[k+1] < q) k++; grid[offset + q*stride] = (q-v[k])**2 + f[v[k]] }
        }
        for (let x = 0; x < w; x++) solve(x, w, h)
        for (let y = 0; y < h; y++) solve(y*w, 1, w)
      }
      transform(outside, width, height); transform(inside, width, height)
      const unit = Math.min(width, height) / 2, data = new Float32Array(size)
      for (let i = 0; i < size; i++) data[i] = (Math.sqrt(outside[i]) - Math.sqrt(inside[i])) / unit
      resolve({ width, height, data })
    }
    image.onerror = reject
    image.src = src
  })
}

function shader(gl, type, source) {
  const value = gl.createShader(type)
  gl.shaderSource(value, source); gl.compileShader(value)
  if (!gl.getShaderParameter(value, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(value) || 'Shader compilation failed'
    gl.deleteShader(value); throw new Error(message)
  }
  return value
}

export default function SparkMark({ src = logo, className, style, colors = ['#abe0f8','#6ed3ff','#1e50a2','#0e1420','#0e1420','#0e1420','#6ed3ff','#abe0f8'], innerGlow = .4, outerGlow = 0, contour = .5, angle = 136, speed = 1 }) {
  const canvasRef = useRef(null)
  const settings = useRef(null)
  settings.current = { colors, innerGlow, outerGlow, contour, angle, speed }

  useEffect(() => {
    const canvas = canvasRef.current
    const gl = canvas?.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
    if (!gl) return undefined
    let program, buffer, texture, frame = 0, alive = true, field = null
    try {
      program = gl.createProgram()
      const vert = shader(gl, gl.VERTEX_SHADER, VERTEX), frag = shader(gl, gl.FRAGMENT_SHADER, FRAGMENT)
      gl.attachShader(program, vert); gl.attachShader(program, frag); gl.bindAttribLocation(program, 0, 'aPosition'); gl.linkProgram(program)
      gl.deleteShader(vert); gl.deleteShader(frag)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader link failed')
      gl.useProgram(program)
      buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
      texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture)
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
      const uniform = name => gl.getUniformLocation(program, name)
      const locations = { field: uniform('uField'), fieldScale: uniform('uFieldScale'), resolution: uniform('uResolution'), time: uniform('uTime'), params: uniform('uMatP'), colors: uniform('uMatC') }
      gl.uniform1i(locations.field, 0)
      const started = performance.now()
      const render = now => {
        if (!alive || !field) return
        frame = requestAnimationFrame(render)
        const ratio = Math.min(window.devicePixelRatio || 1, 2), width = Math.max(1, Math.round(canvas.clientWidth * ratio)), height = Math.max(1, Math.round(canvas.clientHeight * ratio))
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height }
        const current = settings.current, params = new Float32Array(32), palette = new Float32Array(64)
        const list = (Array.isArray(current.colors) ? current.colors : [current.colors]).slice(0, 8)
        list.forEach((color, index) => palette.set(hexRgba(color), index * 4))
        params[0] = list.length; params[1] = current.innerGlow; params[2] = current.outerGlow; params[3] = current.contour; params[4] = current.angle; params[5] = current.speed
        gl.viewport(0, 0, width, height); gl.useProgram(program); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.uniform2f(locations.resolution, width, height); gl.uniform2f(locations.fieldScale, Math.min(field.width,field.height) / 2 / field.width, Math.min(field.width,field.height) / 2 / field.height)
        gl.uniform1f(locations.time, (now - started) / 1000); gl.uniform4fv(locations.params, params); gl.uniform4fv(locations.colors, palette)
        gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      loadField(src).then(result => {
        if (!alive) return
        field = result; gl.bindTexture(gl.TEXTURE_2D, texture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, field.width, field.height, 0, gl.RED, gl.FLOAT, field.data)
        frame = requestAnimationFrame(render)
      }).catch(() => {})
    } catch (error) {
      console.warn('SparkMark WebGL renderer unavailable:', error)
    }
    return () => { alive = false; cancelAnimationFrame(frame); if (texture) gl.deleteTexture(texture); if (buffer) gl.deleteBuffer(buffer); if (program) gl.deleteProgram(program) }
  }, [src])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" style={{ display: 'block', aspectRatio: '1 / 1', ...style }} />
}
