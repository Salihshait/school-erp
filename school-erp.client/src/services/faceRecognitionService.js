import * as faceapi from '@vladmandic/face-api'

const MODEL_URL = '/models'
// Below this Euclidean distance between two descriptors, faces are considered a match.
// face-api.js's own docs suggest ~0.6 as a reasonable default threshold.
export const MATCH_THRESHOLD = 0.55

let modelsPromise = null

export function loadModels() {
  if (!modelsPromise) {
    modelsPromise = Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ])
  }
  return modelsPromise
}

// Detects a single face in a <video> or <img> element and returns its 128-length
// descriptor (Float32Array), or null if no face was found.
export async function detectDescriptor(mediaEl) {
  const result = await faceapi
    .detectSingleFace(mediaEl, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor()
  return result ? result.descriptor : null
}

// Detects every face in a frame — used for group/class-scan attendance capture.
export async function detectAllDescriptors(mediaEl) {
  const results = await faceapi
    .detectAllFaces(mediaEl, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptors()
  return results.map(r => ({ descriptor: r.descriptor, box: r.detection.box }))
}

export function descriptorToArray(descriptor) {
  return Array.from(descriptor)
}

export function descriptorFromArray(arr) {
  return new Float32Array(arr)
}

// enrollments: [{ studentId, descriptor: Float32Array }]. Returns the closest
// match under MATCH_THRESHOLD, or null if nothing is close enough.
export function findBestMatch(descriptor, enrollments) {
  let best = null
  for (const enrollment of enrollments) {
    const distance = faceapi.euclideanDistance(descriptor, enrollment.descriptor)
    if (distance <= MATCH_THRESHOLD && (!best || distance < best.distance)) {
      best = { studentId: enrollment.studentId, distance }
    }
  }
  return best
}
