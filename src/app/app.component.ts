import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'test';
  public baseTableValue: string = '';

  public columns: any[] = [];

  public datas: any[] = [];
  public newDatas: any[] = [];

  public importBaseTableValue() {
    let record = this.baseTableValue.trim().split('\n')
    let headerIndex = record.findIndex(x => x.includes('PO Reference'));
    record = record.splice(headerIndex);
    this.columns = record[0].split('\t').map(x => { return { id: x.trim(), name: x.trim() } });

    this.datas = record.splice(1).map(x => {
      let rowraw = x.split('\t');
      let row: any = {};
      this.columns.forEach((column, index) => {
        row[column.id] = { value: rowraw[index] };
      })

      return row;
    });

  }

  public importInvoice() {
    let alldata = this.baseTableValue.split('\n');
    let groupedData: any[] = [];
    let group: any[] = [];
    alldata.forEach(line => {
      if (line.includes('---------')) {
        groupedData.push(group);
        group = [];
      } else {
        group.push(line);
      }
    });


    groupedData.forEach((x: string[], index) => {
      let v1 = x[0].trim().split(' ');
      let descriptionBegin = x[1].trim().indexOf(' ');
      let descriptionEnd = x[1].indexOf(' ea ');
      let description = x[1].trim().substr(descriptionBegin + 1, descriptionEnd - descriptionBegin - 1);

      let row: any = {};
      let line = v1[1];
      let item = v1[2];
      let qty = parseInt(v1[3], 10).toString();
      var linedata = this.datas.find(x => x['Line #'].value == line);
      if (linedata['Item Description'].value.trim() !== description.trim()) {
        console.log(`'${linedata['Item Description'].value}'`)
        console.log(`'${description}'`)
        linedata['Item Description'].changed = true;
        linedata['Item Description'].value = description;
        console.log('hi');
      }

      if (!linedata['Item#'].value.includes(item)) {
        linedata['Item#'].changed = true;
        linedata['Item#'].value = item;
      }

      if (linedata['Qty'].value !== qty) {
        linedata['Qty'].changed = true;
        linedata['Qty'].value = qty;
      }

      return row;
    })
    console.log(this.newDatas);
  }
}
