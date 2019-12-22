'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users', // tabela
      'avatar_id', // nome da coluna
      {
        type: Sequelize.INTEGER, // tipo da coluna
        references: {model: 'files', key: 'id'}, // tem ligação com com o bd files - campo id
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // caso campo seja deletado, vira nulo
        allowNull: true,
      },
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('users', 'avatar_id');
  },
};

// Criar uma novo campo no bd postgres que link com o id do model file 
