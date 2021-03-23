import { Component, OnInit } from '@angular/core';
import { stepRound } from './customStepCurved';
import { DagreNodesOnlyLayout } from './customDagreNodesOnly';
import { Layout } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public curve: any = stepRound;
  public layout: Layout = new DagreNodesOnlyLayout();
  title = 'ngx-graph-prm';
  nestedTreeData = [{
    id: 'first',
    label: 'ICICI BANK  |  CURRENT ACCOUNT ',
    label1:'A/C NO 12345667087',
    type:'CLIENT',
    children:[
      {
        id: 'second',
        label: 'AXIS BANK  |  SAVINGS ACCOUNT ',
        label1:'A/C NO 12345667087',
        type:'BANK_STATEMENT',
        children:[
          {
            id: 'fourth',
            label: 'ICICI BANK  |  SAVINGS ACCOUNT ',
            label1:'A/C NO 12345667087',
            type:'ACC',
            children: [
              {
                id: 'sixth',
                label: 'F',
                type:'DOC',
              },
              {
                id: 'seventh',
                label: 'G',
                type:'DOC',
              },
              {
                id: 'eighth',
                label: 'H',
                type:'DOC',
              },
              {
                id: 'nineth',
                label: 'H',
                type:'DOC',
              }
            ]
          }
        ]
      },
      {
        id: 'third',
        label: 'SBI BANK  |  CURRENT ACCOUNT ',
        label1:'A/C NO 12345667087',
        type:'ACC',
        children:[
          {
            id: 'fifth',
            label: 'E',
            type:'DOC',
          }
        ]
      }
    ]
  }];

  /* links = [
    {
      id: 'a',
      source: 'first',
    target: 'second',
      label: 'is parent of'
    }, {
      id: 'b',
      source: 'first',
      target: 'third',
      label: 'custom label'
    },
    {
      id: 'c',
      source: 'second',
      target: 'fourth',
      label: 'custom label',
      isNodeCollapsed:true
    } ,
    {
      id: 'd',
      source: 'third',
      target: 'fifth',
      label: 'custom label'
    },
    {
      id: 'e',
      source: 'fourth',
      target: 'sixth',
      label: 'custom label'
    },
    {
      id: 'f',
      source: 'fourth',
      target: 'seventh',
      label: 'custom label'
    } ,
    {
      id: 'g',
      source: 'fourth',
      target: 'eighth',
      label: 'custom label'
    }  ,
    {
      id: 'h',
      source: 'fourth',
      target: 'nineth',
      label: 'custom label'
    } 
  ];
  nodes = [
    {
      id: 'first',
      label: 'ICICI BANK  |  CURRENT ACCOUNT ',
      label1:'A/C NO 12345667087',
      type:'ACC'
    }, {
      id: 'second',
      label: 'AXIS BANK  |  SAVINGS ACCOUNT ',
      label1:'A/C NO 12345667087',
      type:'ACC',
      isCollapsed:true,
    }, {
      id: 'third',
      label: 'SBI BANK  |  CURRENT ACCOUNT ',
      label1:'A/C NO 12345667087',
      type:'ACC'
    },
    {
      id: 'fourth',
      label: 'ICICI BANK  |  SAVINGS ACCOUNT ',
      label1:'A/C NO 12345667087',
      type:'ACC'
    },
    {
      id: 'fifth',
      label: 'E',
      type:'DOC'
    },
    {
      id: 'sixth',
      label: 'F',
      type:'DOC'
    },
    {
      id: 'seventh',
      label: 'G',
      type:'DOC'
    },
    {
      id: 'eighth',
      label: 'H',
      type:'DOC'
    },
    {
      id: 'nineth',
      label: 'H',
      type:'DOC'
    }
  ]; */
  links = [];
  nodes = [];

  test(text){
    alert(text);
  }

  convertToGraphModel(data){
    data.forEach(element => {
      this.nodes.push(element);
      if(element.children){
        this.convertToGraphModel(element.children);
        element.children.forEach(child => {
          let link = {
            id: `${element.id}_${child.id}`,
            source: element.id,
            target: child.id,
            label:'',
            model:{isCollapsed: false}
          }
          this.links.push(link);
          //this.convertToGraphModel(child);
        });
      }
    });
  }

  expandCollapseNode(node){
    node.isRootCollapsed = !node.isRootCollapsed;
    if(node.children){
      this.expandCollapseChildNodes(node.children,node.isRootCollapsed);
      this.expandAndCollapseEdges(node.isRootCollapsed);
    }
  }

  expandCollapseChildNodes(children,doCollapse){
    children.forEach(node => {
      node.isCollapsed = doCollapse;
      if(node.children){
        this.expandCollapseChildNodes(node.children,doCollapse ? doCollapse : node.isRootCollapsed);
      }
    });
  }
  expandAndCollapseEdges(doCollapse){
    let collapsedNodes = this.nodes.filter(n => {
      /* if(doCollapse){
        return !!n.isCollapsed == doCollapse;
      } else {
        return !!n.isCollapsed == doCollapse;
      } */
      return !!n.isCollapsed == doCollapse;
    });
    this.links.forEach( l => {
      if(doCollapse){
        if(collapsedNodes.some(cn => cn.id == l.source || cn.id == l.target)){
          l.model.isCollapsed = doCollapse;
        } 
      } else  {
        if(collapsedNodes.some(cn => cn.id == l.target) ){
          l.model.isCollapsed = doCollapse;
        }
      }
    });
    this.links = [...this.links];
  }

  ngOnInit(){
    this.convertToGraphModel(this.nestedTreeData);
  }
}
