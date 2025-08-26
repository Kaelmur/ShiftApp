import DashboardLayout from "@/components/DashboardLayout";
import { useShiftLocations } from "@/utils/getLocations";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  Polyline,
} from "react-leaflet";
import { useParams } from "react-router-dom";
import { LatLngExpression } from "leaflet";
import Spinner from "@/components/Spinner";

function MapPage() {
  const { shiftId } = useParams<{ shiftId: string }>();

  const { locations, loading } = useShiftLocations(shiftId ?? "");

  if (!shiftId) {
    return <p>ID смены не указан</p>;
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Spinner />
      </div>
    );
  if (locations.length === 0) return <p>Нет координат для этой смены</p>;

  const center: LatLngExpression = [
    locations[0].latitude,
    locations[0].longitude,
  ];

  const polylinePositions: LatLngExpression[] = locations.map((loc) => [
    loc.latitude,
    loc.longitude,
  ]);

  return (
    <DashboardLayout activeMenu="Карта">
      <h2 className="text-xl font-semibold mb-4">Карта смены #{shiftId}</h2>
      <div className="h-[80vh] mt-4 w-full rounded-md overflow-hidden">
        <MapContainer
          center={center}
          zoom={16}
          scrollWheelZoom={true}
          className="h-full w-full rounded-lg shadow"
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Светлая">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Темная">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name="Спутник">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="&copy; <a href='https://www.esri.com/'>Esri</a>, 
      Earthstar Geographics"
                maxZoom={17}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {locations.map((loc) => (
            <Marker key={loc.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                Запись в {new Date(loc.timestamp).toLocaleTimeString("ru-RU")}
              </Popup>
            </Marker>
          ))}
          <Polyline positions={polylinePositions} color="blue" />
        </MapContainer>
      </div>
    </DashboardLayout>
  );
}

export default MapPage;
