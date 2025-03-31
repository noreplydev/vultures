import { spawn } from "child_process";
import * as parser from "xml2json";

export const scanHost = async (host) => {
  const args = [
    "-q",
    "-sS",
    "-sV",
    "--script=vulture/vulture.nse",
    host,
    "-oX",
    "-"
  ];

  return new Promise((resolve) => {
    const child = spawn("nmap", args);

    // Establece la codificación para recibir los datos como texto
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data;
    });

    child.stderr.on("data", (data) => {
      stderr += data;
    });

    child.on("error", (error) => {
      console.error("Fatal error:", error);
      resolve({ isError: true, scan: null });
    });

    child.on("close", () => {
      if (stderr && stderr.trim() !== "") {
        console.error("Error:", stderr);
        return resolve({ isError: true, scan: null });
      }

      const output = stdout.trim();
      if (!output) {
        console.error("No result from nmap error");
        return resolve({ isError: true, scan: null });
      }

      try {
        const scan = JSON.parse(parser.toJson(output));
        resolve({ isError: false, scan });
      } catch (err) {
        console.error("Error decoding nmap output xml:", err);
        resolve({ isError: true, scan: null });
      }
    });
  });
};

export const getServices = (hostInfo) => {
  const services = []
  const ports = hostInfo?.ports?.port ?? []
  if (ports.length) {
    ports.forEach((portData) => {
      const portInfo = getPortInfo(portData)

      // port is the unique mandatory field
      if (portInfo && portInfo.port) {
        services.push({ ...portInfo })
      }
    })
  } else {
    // if ports is a single object instead of an array of objects
    const portInfo = getPortInfo(ports)

    // port is the unique mandatory field
    if (portInfo && portInfo.port) {
      services.push({ ...portInfo })
    }
  }

  return services
}

export const getPortInfo = (portData) => {
  console.log("  (" + portData.portid + ") " + portData?.service?.product)

  const protocol = portData.protocol ?? null
  const state = portData?.state?.state ?? null
  const state_reason = portData?.state?.reason ?? null
  const port = portData?.portid ?? null
  const name = portData?.service?.name ?? null
  const product = portData?.service?.product ?? null
  const product_version = portData?.service?.version ?? null
  let vulnerabilities = null

  if (state && state.toLowerCase() !== "open") {
    return null
  }

  if (portData?.script?.length) {
    const vulnOutput = portData?.script?.find(x => x.id === "vulscan")
    if (vulnOutput?.output) {
      vulnerabilities = parsePortVulns(vulnOutput.output)
    }
  } else {
    if (portData?.script && portData?.script?.output) {
      vulnerabilities = parsePortVulns(portData.script.output)
    }
  }

  return { protocol, state, state_reason, port, name, product, product_version, vulnerabilities }
}

export const parsePortVulns = (databases_string) => {
  const databases = databases_string.split('\n\n')
  const vulns = []

  for (let i = 0; i < databases.length; i++) {
    const database = databases[i].split('\n')
    const dbInfoLine = database[0]
    const vulnEntries = database.slice(1, database.length)
    if (dbInfoLine === "") {
      // end of databases
      continue
    }
    const [dbName, rawDbUrl] = dbInfoLine.split(" - ")
    const dbUrl = rawDbUrl.slice(0, -1)

    for (let x = 0; x < vulnEntries.length; x++) {
      const vulnLine = vulnEntries[x]
      const vuln = {
        vulnerability_source_name: dbName,
        vulnerability_source: dbUrl,
      }

      // vuln entry
      if (vulnLine.startsWith("[")) {
        const [rawVulnCode, vulnDescription] = vulnLine.split("] ")
        const vulnCode = rawVulnCode.slice(1, rawVulnCode.length)
        // pretty printting of the vulnerability
        // console.log("(" + vulnCode + ") " + vulnDescription.slice(0, 15))
        vulns.push({
          ...vuln,
          id: vulnCode,
          description: vulnDescription
        })
      } else if (vulnLine.startsWith("No ")) {
        // no finding
        continue
      } else {
        // unknown line type ignore 
        continue
      }
    }
  }

  return vulns
}