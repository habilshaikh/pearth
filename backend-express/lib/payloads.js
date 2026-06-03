const getField = (body, camelKey, snakeKey) => {
  if (!body || typeof body !== 'object') {
    return undefined;
  }

  if (body[camelKey] !== undefined) {
    return body[camelKey];
  }

  if (snakeKey && body[snakeKey] !== undefined) {
    return body[snakeKey];
  }

  return undefined;
};

const removeUndefined = (object) => (
  Object.fromEntries(
    Object.entries(object).filter(([, value]) => value !== undefined)
  )
);

const parseHomePayload = (body) => removeUndefined({
  heroTitle: getField(body, 'heroTitle', 'hero_title'),
  heroSubtitle: getField(body, 'heroSubtitle', 'hero_subtitle'),
  heroImage: getField(body, 'heroImage', 'hero_image'),
  aboutText: getField(body, 'aboutText', 'about_text'),
  aboutImage: getField(body, 'aboutImage', 'about_image'),
  ctaText: getField(body, 'ctaText', 'cta_text'),
});

const parseServicePayload = (body) => removeUndefined({
  name: getField(body, 'name'),
  description: getField(body, 'description'),
  imageUrl: getField(body, 'imageUrl', 'image_url'),
  sort_order: getField(body, 'sort_order'),
});

const parseMachinePayload = (body) => removeUndefined({
  name: getField(body, 'name'),
  capacity: getField(body, 'capacity'),
  specs: getField(body, 'specs'),
  imageUrl: getField(body, 'imageUrl', 'image_url'),
  sort_order: getField(body, 'sort_order'),
});

const parseInspectionPayload = (body) => removeUndefined({
  name: getField(body, 'name'),
  equipment: getField(body, 'equipment'),
  capability: getField(body, 'capability'),
});

const parseProductPayload = (body) => {
  const images = getField(body, 'images');

  return removeUndefined({
    name: getField(body, 'name'),
    description: getField(body, 'description'),
    specs: getField(body, 'specs'),
    applications: getField(body, 'applications'),
    qualityNote: getField(body, 'qualityNote', 'quality_note'),
    sort_order: getField(body, 'sort_order'),
    images: Array.isArray(images)
      ? images
        .filter((value) => typeof value === 'string' && value.trim())
        .map((imageUrl) => ({ imageUrl: imageUrl.trim() }))
      : undefined,
  });
};

module.exports = {
  getField,
  parseHomePayload,
  parseInspectionPayload,
  parseMachinePayload,
  parseProductPayload,
  parseServicePayload,
  removeUndefined,
};
