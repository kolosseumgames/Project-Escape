/*:
 * @target MZ
 * @plugindesc Maps A/W/S/D + controller shoulders to L1/L2/R1/R2 and runs Common Events.
 *
 * @param L1 Common Event
 * @type common_event
 * @default 1
 *
 * @param L2 Common Event
 * @type common_event
 * @default 2
 *
 * @param R1 Common Event
 * @type common_event
 * @default 3
 *
 * @param R2 Common Event
 * @type common_event
 * @default 4
 *
 */

(() => {
    const params = PluginManager.parameters("ShoulderInputCommonEvents");
    const CE_L1 = Number(params["L1 Common Event"] || 1);
    const CE_L2 = Number(params["L2 Common Event"] || 2);
    const CE_R1 = Number(params["R1 Common Event"] || 3);
    const CE_R2 = Number(params["R2 Common Event"] || 4);

    // Keyboard mapping
    Input.keyMapper[65] = "L1";  // A
    Input.keyMapper[87] = "L2";  // W
    Input.keyMapper[83] = "R1";  // S
    Input.keyMapper[68] = "R2";  // D

    const _SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SceneMap_update.call(this);

        // L1 → A key OR Controller L1
        if (Input.isTriggered("L1") || Input.isTriggered("pageup")) {
            $gameTemp.reserveCommonEvent(CE_L1);
        }

        // L2 → W key OR Controller L2
        if (Input.isTriggered("L2") || Input.isTriggered("shift")) {
            $gameTemp.reserveCommonEvent(CE_L2);
        }

        // R1 → S key OR Controller R1
        if (Input.isTriggered("R1") || Input.isTriggered("pagedown")) {
            $gameTemp.reserveCommonEvent(CE_R1);
        }

        // R2 → D key OR Controller R2
        if (Input.isTriggered("R2") || Input.isTriggered("control")) {
            $gameTemp.reserveCommonEvent(CE_R2);
        }
    };
})();
