export const doSave = async (ossdk, showAlertMessage, saveStatus = (saving) => {}) => {
  try {
    saveStatus(true)
    await ossdk.project_form.save().then(() => {
      showAlertMessage('Saved', 'success')
    })
    saveStatus(false)
  } catch (e) {
    // Show an error message if supplied as an argument. At this time no error is provided
    // so just show a generic error, but when this is returned by sdkBridge then it will
    // appear here.
    let rawErrorMessage = e ? String(e) : ''
    showAlertMessage('Failed to save project. ' + rawErrorMessage, 'error')
  }
}

const applyEquipmentSet = (ossdk, equipmentSet, maxOutputTarget, componentMappingKey) => {
  const calculator_id = 2 // SAM
  const setbackDistanceArray = [0.3048, 0, 0, 0]
  const constraints = { annual_kwh: { max: maxOutputTarget } }

  // @ts-ignore: disable next line
  return ossdk.studio.autoDesignRunAndLoadFromEquipment(
    calculator_id,
    // @ts-ignore: disable next line
    setbackDistanceArray,
    equipmentSet,
    componentMappingKey,
    'auto',
    null,
    constraints
  )
}

const pollUntilShadingReady = async (ossdk) => {
  const getSunAccessFactors = async () => {
    const designData = await ossdk.project_form.getDesignData()
    const systems = designData.object.children.filter((child) => child.type === 'OsSystem')
    return systems.map((s) => s.userData?.output?.shade_metrics?.sun_access_factor)
  }

  for (var i = 0; i < 10; i++) {
    const sunAccessFactors = await getSunAccessFactors()
    const isShadingReady = sunAccessFactors.every((sunAccessFactor) => !!sunAccessFactor)
    console.log('pollUntilShadingReady::isShadingReady', isShadingReady, sunAccessFactors)

    if (isShadingReady) {
      return sunAccessFactors
    }

    // sleep for 3 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
  throw new Error('pollUntilShadingReady::shading did not complete in time')
}

export const runAutoDesign = async (
  ossdk,
  equipmentSet,
  maxOutputTarget,
  componentMappingKey,
  showAlertMessage,
  saveOnComplete
) => {
  try {
    await applyEquipmentSet(ossdk, equipmentSet, maxOutputTarget, componentMappingKey)
    if (saveOnComplete) {
      const sunAccessFactors = await pollUntilShadingReady(ossdk)

      showAlertMessage('Shading is ready. Values:' + sunAccessFactors.join(', ') + '. Start save...', 'success')

      await doSave(ossdk, showAlertMessage)

      showAlertMessage('Auto-Design & Auto-Save Complete', 'success')
    } else {
      showAlertMessage('Auto-Design Complete', 'success')
    }
  } catch (e: any) {
    const msg = e.message || 'Unspecified Error'
    showAlertMessage(`Failed to run auto design: ${msg}`, 'error')
  }
}

export const setLonLat = async (ossdk) => {
  const projectLon = ossdk.project_form.values.value.lon
  const projectLat = ossdk.project_form.values.value.lat
  var lonLat = [projectLon, projectLat]

  ossdk.studio.view.animateToLonLat([lonLat])
}
