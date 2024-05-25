import { forceChunksUpdate } from "./chunk.js";
import { noise_param } from "./marching_cubes/noise.js";
import * as THREE from 'three';


export function updateNoiseGUI(gui) {
    const folder = gui.addFolder('Noise');
    folder.add(noise_param, 'frequency', 0.1, 2, 0.1).onChange(forceChunksUpdate);
    folder.add(noise_param, 'n_octaves', 1, 10, 1).onChange(forceChunksUpdate);
    folder.add(noise_param, 'persistence', 0, 1, 0.1).onChange(forceChunksUpdate);
    folder.add(noise_param, 'lacunarity', 1, 3, 0.1).onChange(forceChunksUpdate);
    folder.add(noise_param, 'threshold', -1, 1, 0.1).onChange(forceChunksUpdate);
}


export function updateAtmoshpereGUI(gui, atmosphere_param, shader) {
    const folder = gui.addFolder('Atmosphere');
    folder.add(atmosphere_param, 'uSunIntensity', 0, 2, 0.01).onChange((value) => shader.uniforms.uSunIntensity.value = value);
    
    const scatteringCoefficients = folder.addFolder('Scattering Coefficients');
    scatteringCoefficients.add(atmosphere_param.uScatteringCoefficients, 'r', 0, 50, 0.001).onChange((value) => shader.uniforms.uScatteringCoefficients.value = new THREE.Vector3(value, shader.uniforms.uScatteringCoefficients.value.y, shader.uniforms.uScatteringCoefficients.value.z));
    scatteringCoefficients.add(atmosphere_param.uScatteringCoefficients, 'g', 0, 50, 0.001).onChange((value) => shader.uniforms.uScatteringCoefficients.value = new THREE.Vector3(shader.uniforms.uScatteringCoefficients.value.x, value, shader.uniforms.uScatteringCoefficients.value.z));
    scatteringCoefficients.add(atmosphere_param.uScatteringCoefficients, 'b', 0, 50, 0.001).onChange((value) => shader.uniforms.uScatteringCoefficients.value = new THREE.Vector3(shader.uniforms.uScatteringCoefficients.value.x, shader.uniforms.uScatteringCoefficients.value.y, value));

    folder.add(atmosphere_param, 'uAtmosphereHeight', 0, 5e-2, 1e-6).onChange((value) => shader.uniforms.uAtmosphereHeight.value = value);
    folder.add(atmosphere_param, 'uEarthRadius', 0, 10, 1e-3).onChange((value) => shader.uniforms.uEarthRadius.value = value);
    
    const sunColorFolder = folder.addFolder('Sun Color');
    sunColorFolder.add(atmosphere_param.uSunColor, 'r', 0, 1, 0.01).onChange((value) => shader.uniforms.uSunColor.value = new THREE.Vector3(value, shader.uniforms.uSunColor.value.y, shader.uniforms.uSunColor.value.z));
    sunColorFolder.add(atmosphere_param.uSunColor, 'g', 0, 1, 0.01).onChange((value) => shader.uniforms.uSunColor.value = new THREE.Vector3(shader.uniforms.uSunColor.value.x, value, shader.uniforms.uSunColor.value.z));
    sunColorFolder.add(atmosphere_param.uSunColor, 'b', 0, 1, 0.01).onChange((value) => shader.uniforms.uSunColor.value = new THREE.Vector3(shader.uniforms.uSunColor.value.x, shader.uniforms.uSunColor.value.y, value));

    folder.add(atmosphere_param, 'uSunTimePeriod', 1, 1e3, 1).onChange((value) => shader.uniforms.uSunTimePeriod.value = value * 1000);

    folder.add(atmosphere_param, 'uRayNumberOfPoints', 1, 100, 1).onChange((value) => shader.uniforms.uRayNumberOfPoints.value = value);

    const resetTimeButton = folder.add({ resetTime: () => { shader.uniforms.uTime.value = -0.15*shader.uniforms.uSunTimePeriod.value; } }, 'resetTime');
    resetTimeButton.name("Reset Time");
}


export function updateViewGUI(gui, view, player) {
    const folder = gui.addFolder('View');
    folder.add(view, 'generation_distance', 1, 64, 1).name("Generation Distance").onChange((new_value) => {
        player.view_distance = new_value;
        player.unloadFarChunks();
        player.loadSurroundingChunks();
    });
}