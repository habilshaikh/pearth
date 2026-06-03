const toPlainObject = (document) => {
  if (!document) {
    return null;
  }
  if (typeof document.toObject === 'function') {
    return document.toObject();
  }
  return document;
};

const withId = (document) => {
  const plain = toPlainObject(document);
  if (!plain) {
    return null;
  }
  const { _id, __v, ...rest } = plain;
  return {
    id: _id?.toString(),
    ...rest,
  };
};

const serializeImage = (image) => {
  const base = withId(image);
  if (!base) {
    return null;
  }
  return {
    ...base,
    image_url: base.imageUrl,
    created_at: base.createdAt,
  };
};

const serializeHomeContent = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    hero_title: base.heroTitle,
    hero_subtitle: base.heroSubtitle,
    hero_image: base.heroImage,
    about_text: base.aboutText,
    about_image: base.aboutImage,
    cta_text: base.ctaText,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
  };
};

const serializeService = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    image_url: base.imageUrl,
    sort_order: base.sort_order ?? 9999,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
  };
};

const serializeMachine = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    image_url: base.imageUrl,
    sort_order: base.sort_order ?? 9999,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
  };
};

const serializeInspection = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
  };
};

const serializeProduct = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    sort_order: base.sort_order ?? 9999,  // ✅ FIX: sort_order explicitly map karo
    quality_note: base.qualityNote,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
    images: Array.isArray(base.images)
      ? base.images.map(serializeImage).filter(Boolean)
      : [],
  };
};

const serializeContactMessage = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    is_read: base.isRead,
    drawing_name: base.drawingName,
    drawing_path: base.drawingPath,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
  };
};

const serializeClientLogo = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  return {
    ...base,
    image_url: base.imageUrl,
    created_at: base.createdAt,
    updated_at: base.updatedAt,
  };
};

const serializeAdminUser = (document) => {
  const base = withId(document);
  if (!base) {
    return null;
  }
  const { password, ...safeUser } = base;
  return {
    ...safeUser,
    created_at: safeUser.createdAt,
    updated_at: safeUser.updatedAt,
  };
};

module.exports = {
  serializeAdminUser,
  serializeClientLogo,
  serializeContactMessage,
  serializeHomeContent,
  serializeImage,
  serializeInspection,
  serializeMachine,
  serializeProduct,
  serializeService,
};
