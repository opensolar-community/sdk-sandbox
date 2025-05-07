import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import { useContext, useState } from 'react'
import { doSave, setLonLat } from '../commands'
import { ContainerContext } from '../ContainerContext'
import { CustomTabPanel, Divider } from '../utils'
import DataModal from './DataModal'

const doDiscard = async (ossdk) => {
  ossdk.project_form
    .discard()
    .then(() => console.log('Project discarded'))
    .catch((e) => console.error('Failed to discard project', e))
}

interface Props {
  selectedTab: number
  tabIndex: number
  tabPrefix: string
}

export function InputButtonMenu({ selectedTab, tabIndex, tabPrefix }: Props) {
  const [showDataModal, setShowDataModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [dataModalContent, setDataModalContent] = useState('')
  const [saving, setSaving] = useState(false)

  const { ossdk, osApiRoot, orgId, loaded, projectKey, hasUnsavedChanges, showAlertMessage, currentRole, progress } =
    useContext(ContainerContext)

  const commonDisablers = !loaded || !projectKey || !currentRole || !progress.idle

  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Stack direction="row" spacing={1}>
        <Button
          variant={'outlined'}
          disabled={commonDisablers}
          onClick={async () => {
            await ossdk.studio.setComponents([
              { code: 'Solaria PowerXT-400R-PM' },
              { code: 'Fronius Primo 5.0-1 208-240 [240V]' },
              { code: 'EVOLVE LFP 5kW/14kWh' },
            ])
            showAlertMessage(
              'US Bundle 1\nComponents added to the system\nModule: Solaria PowerXT-400R-PM\nInverter: Fronius Primo 5.0-1 208-240 [240V]\nBattery: EVOLVE LFP 5kW/14kWh', 'success'
            )
          }}
        >
          US Bundle 1
        </Button>
        <Button
          variant={'outlined'}
          disabled={commonDisablers}
          onClick={async () => {
            await ossdk.studio.setComponents([
              { code: 'Q.PEAK DUO BLK ML-G9+ 380' },
              { code: 'Q.HOME+ ESS HYB-G1 7.6kW' },
              { code: 'Q.HOME+ ESS HYB-G1 6.3kWh' },
            ])
            showAlertMessage(
              'US Bundle 2\nComponents added to the system\nModule: Q.HOME+ ESS HYB-G1 6.3kWh\nInverter: Q.HOME+ ESS HYB-G1 6.3kWh\nBattery: Q.HOME+ ESS HYB-G1 6.3kWh', 'success'
            )
          }}
        >
          US Bundle 2
        </Button>
        <Button
          variant={'outlined'}
          disabled={commonDisablers}
          onClick={async () => {
            let promptMessage = 'Override Setbacks\n\nThis should be pre-configured by your org at https://app.opensolar.com/#/project_configurations.\n\nPlease enter the Project Configuration ID:'
            if (process.env.REACT_APP_PROJECT_CONFIG_IDS) {
              const projectConfigIds = process.env.REACT_APP_PROJECT_CONFIG_IDS.split(",").join(", ")
              promptMessage += ` Possible Values (${projectConfigIds})`
            }
            const configId = prompt(promptMessage)
            if (configId) {
              const configUrl = `${osApiRoot}/api/orgs/${orgId}/project_configurations/${configId}/`
              await ossdk.project_form.setValues({ configuration_override: configUrl })
            }
          }}
        >
          Configure Setback
        </Button>
        <Divider style={{ marginLeft: 20, marginRight: 10 }} orientation="vertical" flexItem />
        <Button variant="outlined" disabled={commonDisablers} onClick={() => setLonLat(ossdk)}>
          Reset Map
        </Button>
        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={() => ossdk.studio.view.setShadingVisibility()}
        >
          Toggle Shade
        </Button>

        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={async () => {
            await ossdk.project_form.setValues({ zip: String(90000 + Math.round(1000 * Math.random())) })
            alert('Zip code set to random value. See Settings->Inspect->Project Form value\'s for details.')
            console.log('setValues complete')
          }}
        >
          Update Zip Code
        </Button>
        <Divider />
        <Button
          variant="outlined"
          color="secondary"
          disabled={commonDisablers || !hasUnsavedChanges}
          onClick={() => doDiscard(ossdk)}
        >
          Discard
        </Button>
        <Button variant="contained" disabled={commonDisablers || saving} onClick={async () => await doSave(ossdk, showAlertMessage, setSaving)}>
          Save
        </Button>
      </Stack>
      <DataModal
        setShowDataModal={setShowDataModal}
        showDataModal={showDataModal}
        dataModalContent={dataModalContent}
        setDataModalContent={setDataModalContent}
        dataTitle={modalTitle}
        setDataTitle={setModalTitle}
      />
    </CustomTabPanel>
  )
}

export function OutputButtonMenu({ selectedTab, tabIndex, tabPrefix }: Props) {
  const [showDataModal, setShowDataModal] = useState(false)
  const [dataModalTitle, setModalTitle] = useState('')
  const [dataModalContent, setDataModalContent] = useState('')

  const { ossdk, loaded, projectKey, system, showAlertMessage, currentRole, progress } =
    useContext(ContainerContext)

  const commonDisablers = !loaded || !projectKey || !currentRole || !progress.idle

  const doGetDesignData = async (ossdk) => {
    ossdk.project_form.getDesignData().then((designData) => {
      setModalTitle('Design Data')
      setDataModalContent(JSON.stringify(designData, null, 2))
      setShowDataModal(true)
    })
  }
  return (
    <CustomTabPanel value={selectedTab} index={tabIndex} prefix={tabPrefix}>
      <Stack direction="row" spacing={1}>
        <Button variant="outlined" disabled={commonDisablers} onClick={() => doGetDesignData(ossdk)}>
          Get Design Data
        </Button>
        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={async () => {
            let shadeMetrics = system ? system.userData.output.shade_metrics : null
            if (!shadeMetrics) {
              // In case objectSelected or objectChanged hasn't been raised yet. Show shade_metrics for the first system.
              const designData = await ossdk.project_form.getDesignData()
              shadeMetrics = designData.object.children[0].userData.output.shade_metrics
            }
            setModalTitle('Shade Metrics')
            setDataModalContent(JSON.stringify(shadeMetrics, null, 2))
            setShowDataModal(true)
          }}
        >
          Get Shade Metrics
        </Button>
        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={async () => {
            let billing = system ? system.userData.bills.proposed : null
            if (!billing) {
              // In case objectSelected or objectChanged hasn't been raised yet. Show shade_metrics for the first system.
              const designData = await ossdk.project_form.getDesignData()
              billing = designData.object.children[0].userData.bills.proposed
            }
            setModalTitle('Billing Data')
            setDataModalContent(JSON.stringify(billing, null, 2))
            setShowDataModal(true)
          }}
        >
          Get Tariff Data
        </Button>
        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={async () => {
            const designData = await ossdk.project_form.getDesignData()
            const systemData = system ? system.userData : designData.object.children[0].userData
            const annualOutput = `${systemData.output.annual} kWh`
            const consumptionOffset = `${systemData.consumption.consumption_offset_percentage}%`
            const annualShadingLoss = systemData.output.details.system.annual_poa_shading_loss_percent_fixed
            const shadingLosses = annualShadingLoss ? `${annualShadingLoss.toFixed(
              1
            )}%` : 'Shading Losses not available'
            showAlertMessage(
              `Annual Output: ${annualOutput}\nConsumption Offset: ${consumptionOffset}\nShading Losses: ${shadingLosses}`, 'info'
            )
          }}
        >
          Show Output
        </Button>
        <Divider style={{ marginLeft: 20, marginRight: 10 }} orientation="vertical" flexItem />

        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={() => {
            ossdk.studio.getSystemImageUrl(system.uuid).then((systemImageUrl) => {
              window.open(systemImageUrl)
            })
          }}
        >
          System Image
        </Button>

        <Button
          variant="outlined"
          disabled={commonDisablers}
          onClick={() => {
            let systemUuid = system.uuid

            if (!systemUuid) {
              showAlertMessage('No selected system to generate share report. Create or load a system.', 'error')
              return
            }

            ossdk.flows.generateDocument({ systemUuid, documentType: 'shade_report' }).then((data) => {
              console.log('Document created', data)
              showAlertMessage(`Document created: ${data.title}`, 'success')
              window.open(data.url)
            })
          }}
        >
          Generate Document
        </Button>
      </Stack>
      <DataModal
        setShowDataModal={setShowDataModal}
        showDataModal={showDataModal}
        dataModalContent={dataModalContent}
        setDataModalContent={setDataModalContent}
        dataTitle={dataModalTitle}
        setDataTitle={setModalTitle}
      />
    </CustomTabPanel>
  )
}
