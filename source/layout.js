// Layout X runs from the kitchen side to the washroom side; Z runs entrance-to-balcony.
// User-confirmed orientation (2026-09-16): facing indoors at the entrance, kitchen LEFT, wash/bath RIGHT.
// Rendering mirrors X so the entrance-facing camera and the physical left/right agree.
// Relative measurements are estimated from the supplied plan, not surveyed dimensions.
export const rooms=[
{id:'all',name:'整个小家',icon:'⌂',title:'从玄关望进去，左边厨房，右边洗面区。',rect:[0,0,3,8.6]},
{id:'entry',name:'玄关',icon:'♧',title:'放下钥匙，也放下一天的忙碌。',rect:[0,0,1.55,1.65],target:[1.03,.8]},
{id:'kitchen',name:'厨房 · 走廊',icon:'♨',title:'给平凡的日子，加一点热气。',rect:[0,1.65,1.55,4.3],target:[1.03,2.8]},
{id:'wash',name:'洗面 · 卫生间',icon:'◉',title:'清清爽爽，开始新的一天。',rect:[1.55,0,3,2.7],target:[1.95,1.8]},
{id:'bath',name:'浴室',icon:'∪',title:'让暖暖的水，洗去疲惫。',rect:[1.55,2.7,3,4.3],target:[2,3.15]},
{id:'living',name:'卧室 · 生活区',icon:'▤',title:'窗边读书，身边有你。',rect:[0,4.3,3,7.7],target:[1.05,5.6]},
{id:'balcony',name:'阳台',icon:'☼',title:'一起等一场日落。',rect:[0,7.7,3,8.6],target:[1.5,8.15]}
];
export const walls=[
[0,0,0,8.6,'outerLeft'],[3,0,3,8.6,'outerRight'],[0,0,.42,0,'entry'],[1.4,0,3,0,'back'],
[1.55,0,1.55,1.46,'wash'],[1.55,2.32,1.55,4.3,'bath'],
[1.55,2.7,1.7,2.7,'bath'],[2.42,2.7,3,2.7,'bath'],
[0,4.3,.62,4.3,'living'],[1.44,4.3,3,4.3,'living'],
[2.4,0,2.4,1.05,'wash'],[2.4,1.05,3,1.05,'wash']
];
export const obstacles=[
[0.06,1.02,.46,1.61,'shoe'],[0.02,1.8,.6,3.36,'counter'],[.02,3.48,.63,4.16,'fridge'],
[2.4,0,3,1.05,'MB'],[1.68,.12,2.3,.69,'laundry'],[2.48,1.18,2.95,1.83,'toilet'],[2.44,2.02,2.98,2.57,'basin'],
[1.65,3.63,2.94,4.22,'tub'],[1.73,4.45,2.92,6.54,'bed'],[1.25,7.05,2.53,7.55,'desk'],[.12,6.95,.84,7.57,'rack'],[.13,5.7,.61,6.13,'chair'],[.1,7.82,.75,8.3,'acUnit']
];
export function roomAt(x,z){if(x<0||x>3||z<0||z>8.6)return null;return rooms.slice(1).find(r=>x>=r.rect[0]&&x<=r.rect[2]&&z>=r.rect[1]&&z<=r.rect[3])?.id??null}
export function canStand(x,z,r=.115){if(x<r||x>3-r||z<r||z>8.6-r)return false;for(const[a,b,c,d]of obstacles)if(x>a-r&&x<c+r&&z>b-r&&z<d+r)return false;for(const[a,b,c,d]of walls){if(x>Math.min(a,c)-r-.035&&x<Math.max(a,c)+r+.035&&z>Math.min(b,d)-r-.035&&z<Math.max(b,d)+r+.035)return false}return true}
const step=.12,NX=25,NZ=72;
function near(x,z){let best=null,dist=Infinity;for(let j=0;j<NZ;j++)for(let i=0;i<NX;i++){let px=(i+.5)*step,pz=(j+.5)*step,d=(px-x)**2+(pz-z)**2;if(d<dist&&canStand(px,pz)){dist=d;best=[i,j]}}return best}
export function findPath(sx,sz,tx,tz){if(!canStand(tx,tz))return null;let s=near(sx,sz),t=near(tx,tz);if(!s||!t)return null;const key=(i,j)=>j*NX+i,start=key(...s),end=key(...t),q=[start],prev=new Map([[start,null]]);for(let h=0;h<q.length;h++){let k=q[h];if(k===end)break;let i=k%NX,j=Math.floor(k/NX);for(const[dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){let a=i+dx,b=j+dz,n=key(a,b);if(a<0||a>=NX||b<0||b>=NZ||prev.has(n)||!canStand((a+.5)*step,(b+.5)*step))continue;prev.set(n,k);q.push(n)}}if(!prev.has(end))return null;let out=[],cur=end;while(cur!==start){out.push([(cur%NX+.5)*step,(Math.floor(cur/NX)+.5)*step]);cur=prev.get(cur)}out.reverse();out.unshift([(s[0]+.5)*step,(s[1]+.5)*step]);out.push([tx,tz]);let last=[sx,sz];for(const next of out){for(let k=1;k<=8;k++)if(!canStand(last[0]+(next[0]-last[0])*k/8,last[1]+(next[1]-last[1])*k/8))return null;last=next}return out}
export const activities=[
{id:'study',label:'坐到书桌前学习',status:'在窗边学习',room:'living',point:[1.87,6.78],angle:0,pose:'sit'},
{id:'rest',label:'在床边休息',status:'坐在床边发呆',room:'living',point:[1.54,5.45],angle:-Math.PI/2,pose:'rest'},
{id:'read',label:'坐下来读书',status:'安静地读一会儿书',room:'living',point:[.78,5.92],angle:Math.PI/2,pose:'read'},
{id:'water',label:'去厨房喝水',status:'在厨房喝水',room:'kitchen',point:[.83,2.96],angle:-Math.PI/2,pose:'drink'},
{id:'wash',label:'洗洗手',status:'在洗手台洗手',room:'wash',point:[2.12,2.27],angle:Math.PI/2,pose:'wash'},
{id:'bath',label:'去浴室看看',status:'在浴室整理毛巾',room:'bath',point:[2.12,3.34],angle:0,pose:'wash'},
{id:'view',label:'去阳台看风景',status:'在阳台看风景',room:'balcony',point:[1.6,8.18],angle:0,pose:'stand'},
{id:'home',label:'到玄关迎接',status:'在玄关等你回来',room:'entry',point:[1,.68],angle:Math.PI,pose:'stand'}
];

// The genkan is a recessed tiled landing. Height is estimated; the direction of the step is confirmed.
export const entryStep={z:1.0,height:.14,width:1.55};
export const planToWorldX=x=>3-x;
export const worldToPlanX=x=>3-x;
export function floorHeight(x,z){return x>=0&&x<entryStep.width&&z>=0&&z<entryStep.z?-entryStep.height:0}
