import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'O nome da categoria é obrigatório.'],
    unique: true,
    trim: true,
    minlength: [3, 'O nome da categoria deve ter no mínimo 3 caracteres.'],
    maxlength: [50, 'O nome da categoria pode ter no máximo 50 caracteres.']
  },
  slogan: {
    type: String,
    trim: true,
    maxlength: [100, 'O slogan pode ter no máximo 100 caracteres.']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  image: {
    type: String,
    default: 'no-image.jpg' // Uma imagem padrão, caso nenhuma seja fornecida
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt
});


// Middleware para criar o "slug" automaticamente antes de salvar
CategorySchema.pre('save', function(next) {
  // Apenas gera o slug se o nome foi modificado (ou é novo)
  if (this.isModified('name')) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')           // Substitui espaços por -
      .replace(/[^\w\-]+/g, '')        // Remove caracteres inválidos
      .replace(/\-\-+/g, '-');         // Substitui múltiplos -- por um único -
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

export default Category