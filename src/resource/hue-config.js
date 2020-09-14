import axios from 'axios';
import { config } from 'dotenv';
config();

const ip = process.env.VUE_APP_HUE_BRIDGE_IP;
const user = process.env.VUE_APP_HUE_USER_ID;
const baseUrl = `http://${ip}/api/${user}`;

export const fetchHueData = async () => {
    const response = await Promise.all([fetchAllGroups(), fetchAllLights()]);
    return { groups: response[0].data, lights: response[1].data };
}

export const fetchAllLights = async () => await axios({ url: `${baseUrl}/lights` });

export const fetchAllGroups = async () => await axios({ url: `${baseUrl}/groups` });

export const toggleLight = async (lightId, light) => {
    console.log(lightId)
    console.log(light)
    await axios({
        url: `${baseUrl}/lights/${lightId}/state`,
        method: 'PUT',
        data: { on: !light.state.on }
    });

}
export const toggleGroup = async (group, lights) => {
    const lightsToToggle = group.lights
        .map(lightId => ({ ...lights[lightId], id: lightId }))
        .filter(light => light.state.on === !group.state.any_on);

        console.log(lightsToToggle);
    const promises = [];
    lightsToToggle.forEach(light => promises.push(toggleLight(light.id, light)));
    await Promise.all(promises);
}

export const setBrightness = async (lightId, brightness) => await axios({
        url: `${baseUrl}/lights/${lightId}/state`,
        method: 'PUT',
        data: { bri: brightness }
    });