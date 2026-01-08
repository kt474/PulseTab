const photoIds = [
  "1506905925346-21bda4d32df4", // https://unsplash.com/photos/aerial-photo-of-foggy-mountains-1527pjeb6jg
  "1469474968028-56623f02e42e", // https://unsplash.com/photos/landscape-photography-of-mountain-hit-by-sun-rays-78A265wPiO4
  "1447752875215-b2761acb3c5d", // https://unsplash.com/photos/blue-and-brown-steel-bridge-eOpewngf68w
  "1433086966358-54859d0ed716", // https://unsplash.com/photos/gray-concrete-bridge-and-waterfalls-during-daytime-cssvEZacHvQ
  "1470071459604-3b5ec3a7fe05", // https://unsplash.com/photos/foggy-mountain-summit-1Z2niiBPg5A
  "1501785888041-af3ef285b470", // https://unsplash.com/photos/three-brown-wooden-boat-on-blue-lake-water-taken-at-daytime-T7K4aEPoGGk
  "1472214103451-9374bd1c798e", // https://unsplash.com/photos/green-grass-field-during-sunset-_RBcxo9AU-U
  "1464822759023-fed622ff2c3b", // https://unsplash.com/photos/green-mountain-across-body-of-water-Bkci_8qcdvQ
  "1767288832047-7d23f6c8c26c", // https://unsplash.com/photos/a-small-blue-tit-bird-perched-on-a-thin-branch-g30TR85fjt4
  "1766859813732-20a127bb6023", // https://unsplash.com/photos/castle-ruins-on-a-hill-above-the-fog-at-sunrise-CEX9Y1gZQjg
  "1766933366411-7a921aebe181", // https://unsplash.com/photos/jagged-mountain-peaks-illuminated-by-golden-hour-sunlight-Q8cUF6c2ytM
  "1765871319901-0aaafe3f1a2a", // https://unsplash.com/photos/misty-forest-valley-with-mountains-in-background-oYEGPZebzGw
  "1765476608471-c30c09564def", // https://unsplash.com/photos/snowy-mountains-under-a-starry-night-sky-SumjjLhysZM
  "1764790355989-8ec00467f547", // https://unsplash.com/photos/river-flows-through-canyon-with-moonlit-mountains-at-dusk-xNuBvTXkdT4
  "1737599136606-3bc63d4d3c52", // https://unsplash.com/photos/a-view-of-a-mountain-range-from-a-distance-NVtdpWi1PQE
  "1764014588235-d339ae275f19", // https://unsplash.com/photos/snow-covered-mountains-under-a-soft-pink-sky-UvibuOZKKc4
  "1761872936185-4ece7c1128ab", // https://unsplash.com/photos/crescent-moon-above-snow-capped-mountains-at-dusk-M2CHE5EDmo8
  "1757918637010-214f0a48ee2d", // https://unsplash.com/photos/star-trails-in-a-night-sky-over-trees-Asi4unAq4us
  "1758351754305-fe00523aaefe", // https://unsplash.com/photos/mountain-peak-emerging-from-dense-fog-SlFfF7DO-mA
  "1484950763426-56b5bf172dbb", // https://unsplash.com/photos/silhouette-of-off-road-car-h8nxGssjQXs
  "1756134904044-1cf7868cb9de", // https://unsplash.com/photos/sunlight-shines-through-ancient-mossy-tree-branches-HHRckNv-gK8
  "1541753236788-b0ac1fc5009d", // https://unsplash.com/photos/snow-capped-mountains-during-daytime-T-FSAK4Bv9c
  "1542676032-6e468ada2953", // https://unsplash.com/photos/white-house-near-shore-ePW8U7EoF54
  "1542856391-010fb87dcfed", // https://unsplash.com/photos/2-person-on-boat-at-lake-during-daytime-TApAkERW5pQ
  "1754386341683-9d713eeda7ed", // https://unsplash.com/photos/mountains-and-a-serene-lake-under-cloudy-skies-FgKADEDCktM
  "1527086983597-b4d44c4a66d0", //https://unsplash.com/photos/suspension-bridge-under-cloudy-sky-_q4-ykeXOPE
  "1731432245325-d820144afe4a", // https://unsplash.com/photos/a-mountain-covered-in-snow-under-a-cloudy-sky-mGx5-xt1uec
  "1731351621470-8aebda14d242", //https://unsplash.com/photos/an-aerial-view-of-a-city-at-night-k5OMsFK0gOg
];

function getToday(): string {
  return new Date().toISOString().split("T")[0]!;
}

interface BackgroundStorage {
  date: string;
  photoId: string;
  previousPhotoId: string | null;
}

export function refreshBackground(): string {
  const today = getToday();
  const stored = localStorage.getItem("background");
  let currentPhotoId = "";

  if (stored) {
    const { photoId } = JSON.parse(stored) as BackgroundStorage;
    currentPhotoId = photoId;
  }

  const availablePhotos = photoIds.filter((id) => id !== currentPhotoId);
  const newPhotoId =
    availablePhotos[Math.floor(Math.random() * availablePhotos.length)];

  localStorage.setItem(
    "background",
    JSON.stringify({
      date: today,
      photoId: newPhotoId,
      previousPhotoId: currentPhotoId,
    } as BackgroundStorage)
  );
  console.log(`https://images.unsplash.com/photo-${newPhotoId}?w=2560&q=90`);
  return `https://images.unsplash.com/photo-${newPhotoId}?w=2560&q=90`;
}

export function getDailyBackground(): string {
  const today = getToday();
  const stored = localStorage.getItem("background");

  if (stored) {
    const { date, photoId } = JSON.parse(stored) as BackgroundStorage;

    // Same day? Return the stored background
    if (date === today) {
      return `https://images.unsplash.com/photo-${photoId}?w=2560&q=90`;
    }
  }

  // New day or first time: pick a new one
  return refreshBackground();
}
