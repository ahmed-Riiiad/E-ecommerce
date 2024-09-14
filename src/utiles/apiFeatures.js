export class ApiFeature {
    constructor(mongooseQuery,reqQuery){
        this.mongooseQuery = mongooseQuery;
        this.reqQuery= reqQuery 
    }

paginate(){
    let page = this.reqQuery.page * 1 || 1
  if(this.reqQuery.page <= 0) page=1
  let skip = (page - 1) * 5;
  this.page = page
  this.mongooseQuery.skip(skip).limit(5)
  return this
}

filterByKeyword() {
    let filtration = {...this.reqQuery}
  let objFiltration = ['sort','page','keyWord','fields']
  objFiltration.forEach((q)=>{
    delete filtration[q]
  })
  filtration = JSON.stringify(filtration)
  filtration = filtration.replace(/\b(gt|gte|ltg|lte)\b/g,match=>`$${match}`)
  filtration = JSON.parse(filtration);
  this.mongooseQuery.find(filtration)
  return this
}

sortBy(){
    if(this.reqQuery.sort){
        let sortedBy =  this.reqQuery.sort.split(',').join(' ')
        this.mongooseQuery.sort(sortedBy)
        }
        return this
}

Search(){
  if(this.reqQuery.Keyword){
    this.mongooseQuery.find({
         $or:[
          {Title:{$regex : this.reqQuery.Keyword ,$options:'i'}},
          {Description:{$regex : this.reqQuery.Keyword ,$options:'i'}}
         ]
    })
    }
    return this

}

selectFields () {
    if(this.reqQuery.fields){
        let fieldedBy =  this.reqQuery.fields.split(',').join(' ')
        this.mongooseQuery.select(fieldedBy)
        }
        return this
} 
   }