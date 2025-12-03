/*:
 * @target MZ
 * @plugindesc v1.1 – Maps keyboard A/W/S/D + controller shoulder buttons (including L2/R2) to Common Events without repeat spam.
 * @author Chatley
 * 
 * @help
 * This plugin allows you to trigger Common Events using:
 *  - Keyboard: A, W, S, D
 *  - Controller: L1, R1 (native RPG Maker bindings)
 *  - Controller: L2, R2 (true analog trigger support)
 *
 * Each input only fires ONCE per press thanks to custom
 * edge-trigger detection for the analog triggers.
 * 
 * No plugin commands.
 *
 * -------------------------------------------------------
 * Button Mapping
 * -------------------------------------------------------
 * L1  = A key  OR controller L1  OR custom "L1"
 * L2  = W key  OR controller L2  (raw button 6)
 * R1  = S key  OR controller R1  OR custom "R1"
 * R2  = D key  OR controller R2  (raw button 7)
 *
 * -------------------------------------------------------
 * Known Gamepad Mappings (XInput Standard)
 * -------------------------------------------------------
 * Button 4 = LB  (L1)
 * Button 5 = RB  (R1)
 * Button 6 = LT  (L2)
 * Button 7 = RT  (R2)
 *
 * If your controller has different mappings, ask Chatley.
 * 
 * -------------------------------------------------------
 * Version History
 * -------------------------------------------------------
 * v1.1 – Added edge detection for L2/R2. Prevents infinite
 *         repeat spam. Fully polished plugin.
 */

 /*~struct~CommonEventMap:
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
  */

(() => {
    const PLUGIN_NAME = "ShoulderInputCommonEvents";
    const params = PluginManager.parameters(PLUGIN_NAME);

    const CE_L1 = Number(params["L1 Common Event"] || 1);
    const CE_L2 = Number(params["L2 Common Event"] || 2);
    const CE_R1 = Number(params["R1 Common Event"] || 3);
    const CE_R2 = Number(params["R2 Common Event"] || 4);

    // ---------------------------------------------
    // Keyboard Mapping
    // ---------------------------------------------
    Input.keyMapper[65] = "L1"; // A
    Input.keyMapper[87] = "L2"; // W
    Input.keyMapper[83] = "R1"; // S
    Input.keyMapper[68] = "R2"; // D

    // ---------------------------------------------
    // Gamepad Helper (raw access)
    // ---------------------------------------------
    function isGamepadButtonPressed(buttonIndex) {
        const pads = navigator.getGamepads?.();
        if (!pads) return false;
        const gp = pads[0];
        if (!gp || !gp.buttons[buttonIndex]) return false;
        return gp.buttons[buttonIndex].pressed;
    }

    // Store last frame’s analog trigger state
    let lastTrigger = { L2: false, R2: false };

    // ---------------------------------------------
    // Hook Scene_Map Update
    // ---------------------------------------------
    const _SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SceneMap_update.call(this);

        // --- L1 ---
        if (Input.isTriggered("L1") || Input.isTriggered("pageup")) {
            $gameTemp.reserveCommonEvent(CE_L1);
        }

        // --- L2 (analog trigger index 6) ---
        const L2_now = isGamepadButtonPressed(6);
        if (Input.isTriggered("L2") || (L2_now && !lastTrigger.L2)) {
            $gameTemp.reserveCommonEvent(CE_L2);
        }
        lastTrigger.L2 = L2_now;

        // --- R1 ---
        if (Input.isTriggered("R1") || Input.isTriggered("pagedown")) {
            $gameTemp.reserveCommonEvent(CE_R1);
        }

        // --- R2 (analog trigger index 7) ---
        const R2_now = isGamepadButtonPressed(7);
        if (Input.isTriggered("R2") || (R2_now && !lastTrigger.R2)) {
            $gameTemp.reserveCommonEvent(CE_R2);
        }
        lastTrigger.R2 = R2_now;
    };
})();
