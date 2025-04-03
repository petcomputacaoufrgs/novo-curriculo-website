import { useEffect, useState } from "react";
import api from "../../api";

function TestTransferImages() {
  const [images, setImages] = useState<{image1: string, image2: string} | null>(null);

  const handleGetImages = async () => {
    const response = await api.get("/plots");
    setImages(response.data);
  }

    handleGetImages();


  return (
    <div>
      {images && (
        <>
	        {/* Agora podemos incluir as imagens diretamente na tag src */}
          <img src={`data:image/png;base64,${images.image1}`} alt="Plot 1" />
          <img src={`data:image/png;base64,${images.image2}`} alt="Plot 2" />
        </>
      )}
    </div>
  );
}

export default TestTransferImages;
