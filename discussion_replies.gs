function myFunction() {

const newId = 131710000000090237
const http = new GetCanvas()
const url = 'https://canvas.instructure.com/api/v1/courses/131710000000025871/discussion_topics?per_page=500‍'
http.get(url)

}
class GetCanvas{

  constructor(){
    this.discussion_id = [];
    this.firstLast = []
    this.id = []
    this.sid = []
  }



  get(url){
    const apiToken = '***'
    const header = {'method': 'GET',
    'headers': {
    'authorization': 'Bearer ' + apiToken,
    'content-type': 'application/json',
    'accept': 'application/json'}
    }

  
  let sheet = SpreadsheetApp.getActiveSheet()
  let rows = sheet.getDataRange().getValues();

  //get the disscussion topics from the api
  let response = UrlFetchApp.fetch(url,header);

  let data = JSON.parse(response)
    for(let i = 0; i< data.length; i++){
      let range =  String.fromCharCode(67+i)+"1"+":"+String.fromCharCode(67+i)+"1";
      if(i >= 24){
        range =  String.fromCharCode(65+(i-24)/24)+String.fromCharCode(65+i-24)+"1"+":"+ String.fromCharCode(65+(i-24)/24) + String.fromCharCode(65+i-24)+"1";
      }
      
      sheet.getRange(range).setValue(data[i]['title']);

      //find the discussion id
      let lastIndex = data[i]['url'].lastIndexOf('~')
      let newId = data[i]['url'].substring(lastIndex+1, data[i]['url'].length)
        if(newId.length <6){
          newId= 1317100000000 + newId
        }
        else{
          newId= 131710000000 + newId
        }

  // get the discussion topics
  let url2 = 'https://canvas.instructure.com/api/v1/courses/131710000000025871/discussion_topics/' + newId+ '/view'
  let dis_res = UrlFetchApp.fetch(url2,header);
  let dis_data = JSON.parse(dis_res)
  let replies = []
  let rep_name = []
  let part_id = []
  let part_name = []

  if(dis_data['participants'] != undefined){
    for(let m = 0; m < dis_data['participants'].length; m++){
        part_id.push(dis_data['participants'][m]['id'])
        part_name.push(dis_data['participants'][m]['display_name'])
    }
  }

  if(dis_data['view'] != undefined){
    for(let j = 0; j < dis_data['view'].length; j++){
      let student_index = part_id.indexOf(dis_data['view'][j]['user_id'])
      let student_name;
      if(student_index != -1){
        student_name = part_name[student_index]
        let original_msg = dis_data['view'][j]['message']
        
        let rep_index = rep_name.indexOf(student_name)
        if(rep_index != -1){
          replies[rep_index] = replies[rep_index] +  "original_message: " + original_msg  + "\n"
        }
        else{
          replies.push("original_message: " + original_msg  + "\n")
          rep_name.push(student_name)
        }
      }

      if(dis_data['view'][j]['replies'] != undefined){
        for(let k = 0; k < dis_data['view'][j]['replies'].length; k++){
          let student_index = part_id.indexOf(dis_data['view'][j]['replies'][k][['user_id']])
          let student_name
          if(student_index != -1){
          student_name = part_name[student_index]
          let reply_msg = dis_data['view'][j]['replies'][k]['message']
          let rep_index = rep_name.indexOf(student_name)
          if(rep_index != -1){
            replies[rep_index] = replies[rep_index] +  "reply_message: " + reply_msg  + "\n"
        }
        else{
          replies.push("reply_message: " + reply_msg + "\n")
          rep_name.push(student_name)

        }
      }

          }
        }

 }

  }



  for(let p = 1; p < rows.length; p++){
    let range = String.fromCharCode(67+i) + (p+1).toString() + ":"+String.fromCharCode(67+i) + (p+1).toString()
    if(i >= 24){
      range =  String.fromCharCode(65+(i-24)/24)+String.fromCharCode(65+i-24)+ (p+1).toString() +":"+ String.fromCharCode(65+(i-24)/24) + String.fromCharCode(65+i-24) + (p+1).toString()
    }
    let str = rows[p][0] + " " + rows[p][1]
    let ind = rep_name.indexOf(str)
    if(ind !=-1){
      sheet.getRange(range).setValue(replies[ind]);
    }
    else{
      sheet.getRange(range).setValue('')
    }
  }
  }
  }


  
 
}


