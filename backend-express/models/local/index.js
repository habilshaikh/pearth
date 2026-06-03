const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const DB_FILE = path.join(__dirname, '..', '..', 'data', 'local-db.json');

const COLLECTIONS = {
  AdminUser: 'adminUsers',
  ClientLogo: 'clientLogos',
  ContactMessage: 'contactMessages',
  HomeContent: 'homeContents',
  Inspection: 'inspections',
  Machine: 'machines',
  Product: 'products',
  Service: 'services',
};

const createEmptyState = () => ({
  adminUsers: [],
  clientLogos: [],
  contactMessages: [],
  homeContents: [],
  inspections: [],
  machines: [],
  products: [],
  services: [],
});

const clone = (value) => JSON.parse(JSON.stringify(value));

const ensureDatabaseFile = () => {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(createEmptyState(), null, 2));
  }
};

const readState = () => {
  ensureDatabaseFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = raw ? JSON.parse(raw) : createEmptyState();
    return { ...createEmptyState(), ...parsed };
  } catch (error) {
    return createEmptyState();
  }
};

const writeState = (state) => {
  ensureDatabaseFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
};

const nowIso = () => new Date().toISOString();
const createId = () => new mongoose.Types.ObjectId().toString();

const getCollection = (state, modelName) => {
  const collectionName = COLLECTIONS[modelName];
  if (!collectionName) {
    throw new Error(`Unknown local model: ${modelName}`);
  }

  if (!Array.isArray(state[collectionName])) {
    state[collectionName] = [];
  }

  return state[collectionName];
};

const getValuesAtPath = (value, parts) => {
  if (parts.length === 0) {
    return [value];
  }

  if (value === null || value === undefined) {
    return [];
  }

  const [head, ...tail] = parts;

  if (Array.isArray(value)) {
    return value.flatMap((entry) => getValuesAtPath(entry, parts));
  }

  return getValuesAtPath(value[head], tail);
};

const matchesQuery = (document, query = {}) => (
  Object.entries(query).every(([key, expected]) => {
    const values = getValuesAtPath(document, key.split('.'));
    return values.some((value) => String(value) === String(expected));
  })
);

const compareValues = (left, right) => {
  if (left === right) {
    return 0;
  }

  if (left === undefined || left === null) {
    return -1;
  }

  if (right === undefined || right === null) {
    return 1;
  }

  if (typeof left === 'number' && typeof right === 'number') {
    return left - right;
  }

  return String(left).localeCompare(String(right));
};

const sortDocuments = (documents, sortSpec) => {
  if (!sortSpec || typeof sortSpec !== 'object') {
    return documents;
  }

  const [[field, direction]] = Object.entries(sortSpec);
  const multiplier = direction >= 0 ? 1 : -1;

  return [...documents].sort((a, b) => {
    const [left] = getValuesAtPath(a, field.split('.'));
    const [right] = getValuesAtPath(b, field.split('.'));
    return compareValues(left, right) * multiplier;
  });
};

const normalizeEmail = (value) => (typeof value === 'string' ? value.trim().toLowerCase() : '');

const createProductImagesArray = (images = []) => {
  const nextImages = Array.from(images, (image) => ({
    ...clone(image),
    _id: image?._id || createId(),
    createdAt: image?.createdAt || nowIso(),
  }));

  nextImages.id = (imageId) => nextImages.find((image) => String(image._id) === String(imageId)) || null;
  nextImages.pull = (criteria) => {
    const targetId = typeof criteria === 'object' ? criteria?._id : criteria;
    const index = nextImages.findIndex((image) => String(image._id) === String(targetId));
    if (index >= 0) {
      nextImages.splice(index, 1);
    }
  };

  const originalPush = nextImages.push.bind(nextImages);
  nextImages.push = (...items) => originalPush(
    ...items.map((item) => ({
      ...clone(item),
      _id: item?._id || createId(),
      createdAt: item?.createdAt || nowIso(),
    }))
  );

  return nextImages;
};

const prepareRecord = (modelName, payload, existingRecord) => {
  const timestamp = nowIso();
  const existing = existingRecord ? clone(existingRecord) : null;

  switch (modelName) {
    case 'AdminUser':
      return {
        _id: existing?._id || createId(),
        email: payload.email !== undefined ? normalizeEmail(payload.email) : existing?.email || '',
        password: payload.password !== undefined ? payload.password : existing?.password || '',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'HomeContent':
      return {
        _id: existing?._id || createId(),
        heroTitle: payload.heroTitle !== undefined ? payload.heroTitle : existing?.heroTitle || '',
        heroSubtitle: payload.heroSubtitle !== undefined ? payload.heroSubtitle : existing?.heroSubtitle || '',
        heroImage: payload.heroImage !== undefined ? payload.heroImage : existing?.heroImage || '',
        aboutText: payload.aboutText !== undefined ? payload.aboutText : existing?.aboutText || '',
        aboutImage: payload.aboutImage !== undefined ? payload.aboutImage : existing?.aboutImage || '',
        ctaText: payload.ctaText !== undefined ? payload.ctaText : existing?.ctaText || '',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'Service':
      return {
        _id: existing?._id || createId(),
        name: payload.name !== undefined ? payload.name : existing?.name || '',
        description: payload.description !== undefined ? payload.description : existing?.description || '',
        imageUrl: payload.imageUrl !== undefined ? payload.imageUrl : existing?.imageUrl || '',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'Machine':
      return {
        _id: existing?._id || createId(),
        name: payload.name !== undefined ? payload.name : existing?.name || '',
        capacity: payload.capacity !== undefined ? payload.capacity : existing?.capacity || '',
        specs: payload.specs !== undefined ? payload.specs : existing?.specs || '',
        imageUrl: payload.imageUrl !== undefined ? payload.imageUrl : existing?.imageUrl || '',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'Inspection':
      return {
        _id: existing?._id || createId(),
        name: payload.name !== undefined ? payload.name : existing?.name || '',
        equipment: payload.equipment !== undefined ? payload.equipment : existing?.equipment || '',
        capability: payload.capability !== undefined ? payload.capability : existing?.capability || '',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'ClientLogo':
      return {
        _id: existing?._id || createId(),
        name: payload.name !== undefined ? payload.name : existing?.name || '',
        imageUrl: payload.imageUrl !== undefined ? payload.imageUrl : existing?.imageUrl || '',
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'ContactMessage':
      return {
        _id: existing?._id || createId(),
        name: payload.name !== undefined ? payload.name : existing?.name || '',
        email: payload.email !== undefined ? normalizeEmail(payload.email) : existing?.email || '',
        phone: payload.phone !== undefined ? payload.phone : existing?.phone || '',
        subject: payload.subject !== undefined ? payload.subject : existing?.subject || '',
        message: payload.message !== undefined ? payload.message : existing?.message || '',
        isRead: payload.isRead !== undefined ? Boolean(payload.isRead) : existing?.isRead || false,
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    case 'Product':
      return {
        _id: existing?._id || createId(),
        name: payload.name !== undefined ? payload.name : existing?.name || '',
        description: payload.description !== undefined ? payload.description : existing?.description || '',
        specs: payload.specs !== undefined ? payload.specs : existing?.specs || '',
        applications: payload.applications !== undefined ? payload.applications : existing?.applications || '',
        qualityNote: payload.qualityNote !== undefined ? payload.qualityNote : existing?.qualityNote || '',
        images: (payload.images !== undefined ? payload.images : existing?.images || []).map((image) => ({
          _id: image?._id || createId(),
          imageUrl: image?.imageUrl || '',
          createdAt: image?.createdAt || timestamp,
        })),
        createdAt: existing?.createdAt || timestamp,
        updatedAt: timestamp,
      };
    default:
      throw new Error(`Unsupported local model: ${modelName}`);
  }
};

class LocalDocument {
  constructor(modelName, data) {
    this.__modelName = modelName;
    this.__apply(data);
  }

  __apply(data) {
    const nextData = clone(data);
    Object.keys(this).forEach((key) => {
      if (!key.startsWith('__')) {
        delete this[key];
      }
    });
    Object.assign(this, nextData);

    if (this.__modelName === 'Product') {
      this.images = createProductImagesArray(nextData.images || []);
    }
  }

  toObject() {
    const plain = {};
    Object.keys(this).forEach((key) => {
      if (!key.startsWith('__')) {
        plain[key] = key === 'images' && Array.isArray(this.images)
          ? this.images.map((image) => ({
            _id: image._id,
            imageUrl: image.imageUrl,
            createdAt: image.createdAt,
          }))
          : clone(this[key]);
      }
    });
    return plain;
  }

  async save() {
    const state = readState();
    const collection = getCollection(state, this.__modelName);
    const index = collection.findIndex((entry) => String(entry._id) === String(this._id));
    const record = prepareRecord(this.__modelName, this.toObject(), index >= 0 ? collection[index] : null);

    if (index >= 0) {
      collection[index] = record;
    } else {
      collection.push(record);
    }

    writeState(state);
    this.__apply(record);
    return this;
  }

  async deleteOne() {
    const state = readState();
    const collection = getCollection(state, this.__modelName);
    const nextCollection = collection.filter((entry) => String(entry._id) !== String(this._id));
    state[COLLECTIONS[this.__modelName]] = nextCollection;
    writeState(state);
  }
}

class LocalQuery {
  constructor(modelName, type, query) {
    this.modelName = modelName;
    this.type = type;
    this.query = query;
    this.sortSpec = null;
    this.asLean = false;
  }

  sort(spec) {
    this.sortSpec = spec;
    return this;
  }

  lean() {
    this.asLean = true;
    return this;
  }

  exec() {
    const state = readState();
    const collection = getCollection(state, this.modelName);

    let matches;
    if (this.type === 'byId') {
      matches = collection.filter((entry) => String(entry._id) === String(this.query));
    } else {
      matches = collection.filter((entry) => matchesQuery(entry, this.query || {}));
    }

    matches = sortDocuments(matches, this.sortSpec);

    if (this.type === 'many') {
      return this.asLean
        ? matches.map((entry) => clone(entry))
        : matches.map((entry) => new LocalDocument(this.modelName, entry));
    }

    const first = matches[0] || null;
    if (!first) {
      return null;
    }

    return this.asLean ? clone(first) : new LocalDocument(this.modelName, first);
  }

  then(resolve, reject) {
    return Promise.resolve(this.exec()).then(resolve, reject);
  }

  catch(reject) {
    return this.then(undefined, reject);
  }
}

const createLocalModel = (modelName) => ({
  find(query = {}) {
    return new LocalQuery(modelName, 'many', query);
  },
  findOne(query = {}) {
    return new LocalQuery(modelName, 'one', query);
  },
  findById(id) {
    return new LocalQuery(modelName, 'byId', id);
  },
  async create(payload) {
    const state = readState();
    const collection = getCollection(state, modelName);
    const record = prepareRecord(modelName, payload, null);
    collection.push(record);
    writeState(state);
    return new LocalDocument(modelName, record);
  },
  async insertMany(items) {
    const created = [];
    for (const item of items) {
      created.push(await this.create(item));
    }
    return created;
  },
  async countDocuments(query = {}) {
    const state = readState();
    const collection = getCollection(state, modelName);
    return collection.filter((entry) => matchesQuery(entry, query)).length;
  },
  async findByIdAndUpdate(id, update, options = {}) {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    Object.assign(existing, update);
    await existing.save();
    return options.new ? existing : await this.findById(id);
  },
  async findByIdAndDelete(id) {
    const existing = await this.findById(id);
    if (!existing) {
      return null;
    }

    await existing.deleteOne();
    return existing;
  },
});

const initializeLocalDatabase = async () => {
  ensureDatabaseFile();
  return {
    provider: 'local',
    status: 'connected',
  };
};

module.exports = {
  AdminUser: createLocalModel('AdminUser'),
  ClientLogo: createLocalModel('ClientLogo'),
  ContactMessage: createLocalModel('ContactMessage'),
  HomeContent: createLocalModel('HomeContent'),
  Inspection: createLocalModel('Inspection'),
  Machine: createLocalModel('Machine'),
  Product: createLocalModel('Product'),
  Service: createLocalModel('Service'),
  initializeLocalDatabase,
};
