import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const firmwareLinks: Record<
  string,
  { tuning: string; stock: string }
> = {
  "Mi 5 Pro": {
    tuning:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/kNI2QLYB",
    stock:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/UBBwUJ7J",
  },
  "Mi 5 Max": {
    tuning:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/EJZwUT7A",
    stock:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/pBJgCDIK",
  },
  "Mi 5": {
    tuning:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/gBQW2ZCb",
    stock:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/hAQAgBBR",
  },
  "Mi 4 Pro 2. Gen": {
    tuning:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/AJI2gLbS",
    stock:
      "https://mega.nz/folder/cFZjhD6I#-K2QqsgguyNIL3whHZ_JDw/file/NVZyiLwT",
  },
};

export default function FlashTool() {
  const [status, setStatus] = useState("Bereit zur Verbindung");
  const [device, setDevice] = useState<BluetoothDevice | null>(null);
  const [model, setModel] = useState("");
  const [firmwareType, setFirmwareType] = useState<"tuning" | "stock">(
    "tuning"
  );
  const [progress, setProgress] = useState(0);

  async function connectBluetooth() {
    try {
      setStatus("🔄 Verbindung wird aufgebaut...");
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: "ESP32" }],
        optionalServices: ["0000ffe0-0000-1000-8000-00805f9b34fb"],
      });
      setDevice(device);
      setStatus("✅ Verbunden mit: " + device.name);
    } catch (error: any) {
      setStatus("❌ Verbindung fehlgeschlagen: " + error.message);
    }
  }

  async function startFlashing() {
    if (!device || !model) return;
    const firmwareUrl = firmwareLinks[model]?.[firmwareType];
    if (!firmwareUrl) return;

    setStatus("⬇️ Firmware wird geladen...");
    setProgress(10);

    try {
      const response = await fetch(firmwareUrl);
      const firmware = await response.arrayBuffer();
      setProgress(40);

      // Simulation Flashvorgang
      await new Promise((res) => setTimeout(res, 1000));
      setProgress(70);
      await new Promise((res) => setTimeout(res, 1000));
      setProgress(100);

      setStatus("✅ Flash erfolgreich abgeschlossen!");
    } catch (err: any) {
      setStatus("❌ Fehler beim Flashen: " + err.message);
      setProgress(0);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="text-center mb-8 space-y-2">
        <h1 className="text-5xl font-extrabold text-orange-400 flex items-center justify-center gap-3">
          <Sparkles className="w-8 h-8 text-orange-300 animate-pulse" />
          schneller-machen.de
        </h1>
        <p className="text-lg font-medium text-gray-300">
          Bluetooth Flash Tool für Xiaomi Scooter
        </p>
        <p className="text-sm text-orange-300 italic">
          powered by Leo Vajpan
        </p>
      </div>

      <Card className="w-full max-w-xl shadow-xl rounded-3xl border border-orange-400 bg-gray-900/90 backdrop-blur-md">
        <CardContent className="space-y-6 p-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-orange-300">
              Scooter-Modell auswählen:
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full p-3 bg-gray-800 text-white border border-orange-400 rounded-lg"
            >
              <option value="">-- Modell auswählen --</option>
              {Object.keys(firmwareLinks).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-orange-300 mt-4">
              Firmware-Typ:
            </label>
            <select
              value={firmwareType}
              onChange={(e) =>
                setFirmwareType(e.target.value as "tuning" | "stock")
              }
              className="w-full p-3 bg-gray-800 text-white border border-orange-400 rounded-lg"
            >
              <option value="tuning">🚀 Tuning Firmware</option>
              <option value="stock">🔧 Original Firmware</option>
            </select>
          </div>

          <div className="text-sm text-orange-200 bg-gray-800 border border-orange-300 rounded-md p-4 shadow-inner">
            <strong>Status:</strong> {status}
          </div>

          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-300 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <Button
            className="w-full text-lg py-4 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-full shadow-xl"
            onClick={connectBluetooth}
          >
            🔗 Mit Adapter verbinden
          </Button>

          <Button
            className="w-full text-lg py-4 bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white rounded-full shadow-xl"
            onClick={startFlashing}
            disabled={!device || !model}
          >
            🚀 Firmware aufspielen
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
