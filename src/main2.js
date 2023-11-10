const { app, BrowserWindow } = require('electron');
const fs = require('fs')
const path = require('path')

var electron = require('electron');
var{ipcRenderer}=electron


var btnCreate = document.getElementById('btnCreate')
var btnRead = document.getElementById('btnRead')
var btnDelete = document.getElementById('btnDelete')
var btnUpdate = document.getElementById('btnUpdate')
var productName = document.getElementById('productName')
var productDescription = document.getElementById('productDescription')

let pathName = path.join(__dirname, 'Files')

btnCreate.addEventListener('click', function(){ 
  let file = path.join(pathName, productName.value)
  let contents = productDescription.value

  fs.writeFile(file, contents, function(err){ 
    if(err){
      return console.log(err)
    }
    var txtfile = document.getElementById("productName").value
    alert("You added your makeup list!") 

    ipcRenderer.send('fileCreated', { name: productName.value, description: productDescription.value });
  })
})

btnRead.addEventListener('click', function(){ 
  let file = path.join(pathName, productName.value)
  fs.readFile(file, function(err, data){ 
    if(err){
      return console.log(err)
    }
    productDescription.value = data
    alert("Read Me!")
    console.log("Read It!")
  })
})

btnDelete.addEventListener('click', function(){ 
  let file = path.join(pathName, productName.value)

  fs.unlink(file, function(err){ 
    if(err){
      return console.log(err);
    }

    ipcRenderer.send('fileModified', { action: 'delete', name: productName.value });

    console.log('File deletion event emitted:', productName.value);
    productName.value = "";
    productDescription.value = "";
    alert("You deleted me!")
    console.log("You have deleted!")
  })
})

btnUpdate.addEventListener('click',function(){
  let file = path.join(pathName,productName.value)
  let content = productDescription.value
  fs.writeFile(file,content,function(err){
      if(err){
          return console.log(err)
      }
      var txtfile=document.getElementById("productName").value
      alert("You have updated your list!")
      console.log("The file was created")
      productName.value=""
      productDescription.value=""

      ipcRenderer.send('fileModified', { action: 'createOrUpdate', name: txtfile, description: content });
  })
})

ipcRenderer.on('updateFileList', (event, storedData) => {
  const fileList = document.querySelector('ul');
  fileList.innerHTML = ''; // Clear the existing list

  storedData.forEach((fileData) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `Name: ${fileData.name}<br>Description: ${fileData.description}`;
    fileList.appendChild(listItem);
  });
});




