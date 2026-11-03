
import { Container } from "@cloudflare/containers";

export class QuantBuildContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "30m";
}

interface Env {
  QUANTBUILD: DurableObjectNamespace<QuantBuildContainer>;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const container = env.QUANTBUILD.getByName("quantbuild-primary");
    return container.fetch(request);
  }
};
