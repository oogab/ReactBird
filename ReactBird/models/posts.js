// This model was generated by Forest CLI. However, you remain in control of your models.
// Learn how here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models
module.exports = (sequelize, DataTypes) => {
  const { Sequelize } = sequelize;
  // This section contains the fields of your model, mapped to your table's columns.
  // Learn more here: https://docs.forestadmin.com/documentation/v/v6/reference-guide/models/enrich-your-models#declaring-a-new-field-in-a-model
  const Posts = sequelize.define('posts', {
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'Posts',
  });

  // This section contains the relationships for this model. See: https://docs.forestadmin.com/documentation/v/v6/reference-guide/relationships#adding-relationships.
  Posts.associate = (models) => {
    Posts.belongsTo(models.users, {
      foreignKey: {
        name: 'userIdKey',
        field: 'UserId',
      },
      as: 'user',
    });
    Posts.belongsTo(models.posts, {
      foreignKey: {
        name: 'retweetIdKey',
        field: 'RetweetId',
      },
      as: 'retweet',
    });
    Posts.belongsToMany(models.users, {
      through: 'like',
      foreignKey: 'PostId',
      otherKey: 'UserId',
      as: 'usersThroughLikes',
    });
    Posts.belongsToMany(models.hashtags, {
      through: 'postHashtag',
      foreignKey: 'PostId',
      otherKey: 'HashtagId',
      as: 'hashtagsThroughPostHashtags',
    });
    Posts.hasMany(models.comments, {
      foreignKey: {
        name: 'postIdKey',
        field: 'PostId',
      },
      as: 'postComments',
    });
    Posts.hasMany(models.images, {
      foreignKey: {
        name: 'postIdKey',
        field: 'PostId',
      },
      as: 'postImages',
    });
    Posts.hasMany(models.posts, {
      foreignKey: {
        name: 'retweetIdKey',
        field: 'RetweetId',
      },
      as: 'retweetPosts',
    });
  };

  return Posts;
};