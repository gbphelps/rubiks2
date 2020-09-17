import getUserTorque from '../getUserTorque';
import { getAction, setAction } from '../action';
import { progress, easeInOut, lerp } from '../utils/animation';
import { setUserEventsEnabled } from '../events';
import updateRegistry from './updateRegistry';

interface ProgressFunctionParams {
  tranche: (THREE.Object3D | null)[],
  unitTorque: THREE.Vector3,
  fromTorque: number,
  toTorque: number,
  duration: number,
  addlCleanup?: () => void,
}

export function makeProgressFn({
  tranche, unitTorque, toTorque, fromTorque, duration, addlCleanup,
}: ProgressFunctionParams) {
  return progress(
    duration,
    easeInOut,
    (p: number) => {
      const from = fromTorque;
      const to = toTorque;

      const degrees = lerp(p, from, to);
      console.log(degrees);
      tranche.forEach((box) => {
        if (!box) throw new Error();
        box.setRotationFromAxisAngle(
          unitTorque,
          degrees,
        );
      });
    },
    () => {
      updateRegistry(unitTorque, toTorque, tranche);
      setUserEventsEnabled(true);
      if (addlCleanup) addlCleanup();
    },
  );
}

export default function setAutocorrectTwist(e: MouseEvent) {
  const action = getAction();
  if (action?.type !== 'twist') throw new Error();
  if (!action.torqueParams) {
    // no twisting has been applied - no need for cleanup.
    setAction(null);
    return;
  }

  setUserEventsEnabled(false);

  const torque = getUserTorque(e);
  const quarterSlice = Math.PI / 2;

  const toTorque = Math.round(torque / quarterSlice) * quarterSlice;

  const {
    tranche, unitTorque,
  } = action.torqueParams!;

  setAction({
    type: 'twist-autocorrect',
    params: {
      progressFn: makeProgressFn({
        tranche,
        unitTorque,
        toTorque,
        fromTorque: torque,
        duration: 300,
      }),
      tranche,
      unitTorque,
      toTorque,
    },
  });
}
