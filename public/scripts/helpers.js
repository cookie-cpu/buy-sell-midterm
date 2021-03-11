const generateFeaturedIDs = function (MaxPostID) {
  let vals = [];
  while(vals.length < 3){ //amount of posts to feature
      let num = Math.floor(Math.random() * MaxPostID) + 1; //the max id of the posts to feature
      if(vals.indexOf(num) === -1) vals.push(num);
  }
  return vals;
}


module.exports = {generateFeaturedIDs};
