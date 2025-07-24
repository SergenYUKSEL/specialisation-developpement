import { headers } from "../utils/auth";

export const deleteProduct = async (productId) => {
  if (!productId) throw new Error("L'id du produit est requis");

  try {
    const response = await fetch(
      `http://localhost:3000/api/products/${productId}`,
      {
        method: "DELETE",
        // headers: headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Erreur de suppression");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur dans deleteProduct :", error);
    alert("Erreur lors de la suppression du produit");
  }
};
