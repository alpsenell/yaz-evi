import { Directive } from "vue";
import { trackEvent } from "../utils/analytics";

interface TrackElement extends HTMLElement {
  __trackName?: string;
  __trackHandler?: () => void;
}

const track: Directive<TrackElement, string | undefined> = {
  beforeMount(el, binding) {
    el.__trackName = binding.value;
    el.__trackHandler = () => {
      if (el.__trackName) {
        trackEvent(el.__trackName);
      }
    };
    el.addEventListener("click", el.__trackHandler);
  },
  updated(el, binding) {
    el.__trackName = binding.value;
  },
  unmounted(el) {
    if (el.__trackHandler) {
      el.removeEventListener("click", el.__trackHandler);
    }
  },
};

export default track;
