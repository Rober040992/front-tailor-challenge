export type RestaurantFormErrors = {
  address?: string;
  description?: string;
  name?: string;
};

export function validateRestaurantForm(
  name: string,
  address: string,
  description: string,
): RestaurantFormErrors {
  const errors: RestaurantFormErrors = {};

  if (!name.trim()) {
    errors.name = "Restaurant name is required.";
  }

  if (!address.trim()) {
    errors.address = "Restaurant address is required.";
  }

  if (!description.trim()) {
    errors.description = "Restaurant description is required.";
  }

  return errors;
}
