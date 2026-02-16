import { html, css } from 'polylib';
import { PlForm } from '@nfjs/front-pl/components/pl-form.js';
import '@plcmp/pl-flex-layout';
import '@plcmp/pl-radio-group';
import '@plcmp/pl-radio-button';
import '@plcmp/pl-icon-button';
import '@plcmp/pl-badge';
import '@plcmp/pl-button';
import d3 from '/portal/forms/portal/lib/d3.js';
import { orgTreeRows, peopleRows, initials } from '/portal/forms/portal/lib/portal-utils.js';

const CANVAS_WIDTH = 1880;
const CANVAS_HEIGHT = 920;
const CARD_WIDTH = 300;
const CARD_HEIGHT = 150;
const ZOOM_MIN = 0.6;
const ZOOM_MAX = 1.8;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function byId(rows) {
  return new Map((Array.isArray(rows) ? rows : []).map((row) => [row.id, row]));
}

function plural(count, one, few, many) {
  const n = Math.abs(Number(count) || 0) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

function countLabel(value) {
  const count = Number(value) || 0;
  return `${count} ${plural(count, 'сотрудник', 'сотрудника', 'сотрудников')}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function linkPath(source, target) {
  if (!source || !target) return '';
  const sx = Math.round(source.x + (CARD_WIDTH / 2));
  const sy = Math.round(source.y + CARD_HEIGHT);
  const ex = Math.round(target.x + (CARD_WIDTH / 2));
  const ey = Math.round(target.y - 2);

  if (ey <= sy) return `M ${sx} ${sy} L ${ex} ${ey}`;
  if (Math.abs(ex - sx) < 4) return `M ${sx} ${sy} V ${ey}`;

  const middleY = Math.round((sy + ey) / 2);
  const direction = ex > sx ? 1 : -1;
  const radius = Math.max(
    0,
    Math.min(
      14,
      Math.floor(Math.abs(ex - sx) / 2),
      Math.floor(Math.abs(ey - sy) / 2) - 2
    )
  );

  if (radius < 2) {
    return `M ${sx} ${sy} V ${middleY} H ${ex} V ${ey}`;
  }

  const firstCornerY = middleY - radius;
  const secondCornerY = middleY + radius;
  const firstCornerX = sx + (direction * radius);
  const secondCornerX = ex - (direction * radius);

  return [
    `M ${sx} ${sy}`,
    `V ${firstCornerY}`,
    `Q ${sx} ${middleY} ${firstCornerX} ${middleY}`,
    `H ${secondCornerX}`,
    `Q ${ex} ${middleY} ${ex} ${secondCornerY}`,
    `V ${ey}`
  ].join(' ');
}

export default class PortalOrgChartForm extends PlForm {
  static properties = {
    formTitle: { type: String, value: 'Портал: Оргчарт' },
    hideHeader: { type: Boolean, value: true },
    chartMode: { type: String, value: 'operational', observer: '_chartModeObserver' },
    zoomPercent: { type: Number, value: 100 },
    authorLabel: { type: String, value: '' }
  };

  static css = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      min-height: 0;
    }

    .shell {
      width: 100%;
      height: 100%;
      min-height: 0;
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .chart-toolbar {
      width: 100%;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      box-sizing: border-box;
      background: var(--pl-background-color);
    }

    .mode-switch {
      --pl-base-size: 36px;
    }

    .toolbar-spacer {
      flex: 1;
      min-width: 0;
    }

    .zoom-label {
      min-width: 72px;
      justify-content: center;
      pointer-events: none;
    }

    .chart-panel {
      flex: 1;
      min-height: 0;
      width: 100%;
      border: 1px solid var(--pl-grey-base);
      border-radius: var(--pl-border-radius);
      background: var(--pl-background-color);
      box-sizing: border-box;
      padding: 10px;
      gap: 8px;
      overflow: hidden;
    }

    .chart-meta {
      gap: 8px;
      align-items: center;
      flex-wrap: wrap;
    }

    .chart-meta pl-badge {
      --pl-badge-bg: rgba(42, 124, 113, 0.1);
      --pl-badge-color: var(--pl-primary-base);
      --pl-badge-border-color: rgba(42, 124, 113, 0.24);
    }

    .chart-viewport {
      flex: 1;
      min-width: 0;
      min-height: 0;
      border: 1px solid var(--pl-grey-base);
      border-radius: 14px;
      background: var(--pl-background-color);
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
    }

    .chart-svg {
      width: 100%;
      height: 100%;
      display: block;
      cursor: grab;
      user-select: none;
    }

    .chart-svg.is-dragging {
      cursor: grabbing;
    }

    .org-link {
      fill: none;
      stroke: rgba(90, 112, 142, 0.82);
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .node-html {
      width: ${CARD_WIDTH}px;
      height: ${CARD_HEIGHT}px;
      min-height: ${CARD_HEIGHT}px;
      border: 1px solid var(--pl-grey-base);
      border-radius: 14px;
      box-sizing: border-box;
      padding: 10px;
      display: grid;
      gap: 6px;
      background: var(--pl-background-color);
      color: var(--pl-header-color);
      overflow: hidden;
    }

    .node-html.clickable {
      cursor: pointer;
    }

    .node-html.clickable:hover {
      border-color: var(--pl-primary-light);
      box-shadow: 0 6px 16px rgba(32, 65, 82, 0.12);
    }

    .node-title {
      font: var(--pl-header-font);
      color: var(--pl-primary-base);
      font-size: 16px;
      line-height: 1.1;
      font-weight: 800;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-count {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 11px;
      font-weight: 600;
      margin-top: -2px;
    }

    .node-head {
      display: grid;
      grid-template-columns: 38px minmax(0, 1fr);
      gap: 8px;
      align-items: center;
      border: 1px solid transparent;
      border-radius: 10px;
      padding: 4px;
      box-sizing: border-box;
      cursor: pointer;
      background: rgba(42, 124, 113, 0.05);
    }

    .node-head:hover {
      border-color: var(--pl-primary-light);
      background: rgba(42, 124, 113, 0.1);
    }

    .node-avatar {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      border: 1px solid var(--pl-grey-base);
      overflow: hidden;
      background: var(--pl-background-color);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--pl-grey-darkest);
      font: var(--pl-text-font);
      font-size: 11px;
      font-weight: 700;
    }

    .node-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .node-avatar span {
      width: 100%;
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .node-head-main {
      min-width: 0;
      display: grid;
      gap: 2px;
    }

    .node-head-name {
      font: var(--pl-header-font);
      color: var(--pl-primary-base);
      font-size: 13px;
      line-height: 1.1;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .node-head-role,
    .node-head-contact {
      font: var(--pl-text-font);
      color: var(--pl-grey-darkest);
      font-size: 10px;
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 1320px) {
      .chart-toolbar {
        flex-wrap: wrap;
      }

      .toolbar-spacer {
        display: none;
      }
    }
  `;

  static template = html`
    <pl-flex-layout class="shell" vertical gap="8">
      <pl-flex-layout class="chart-toolbar">
        <pl-radio-group class="mode-switch" selected="{{chartMode}}">
          <pl-radio-button name="operational" label="Операционная структура"></pl-radio-button>
          <pl-radio-button name="legal" label="Юридическая структура"></pl-radio-button>
        </pl-radio-group>

        <div class="toolbar-spacer"></div>

        <pl-icon-button variant="ghost" iconset="pl-default" icon="minus" on-click="[[onZoomOut]]"></pl-icon-button>
        <pl-button class="zoom-label" variant="ghost">[[zoomPercent]]%</pl-button>
        <pl-icon-button variant="ghost" iconset="pl-default" icon="plus" on-click="[[onZoomIn]]"></pl-icon-button>
        <pl-button variant="ghost" on-click="[[onCenterChart]]">Центр</pl-button>
      </pl-flex-layout>

      <pl-flex-layout class="chart-panel" vertical>
        <pl-flex-layout class="chart-meta">
          <pl-badge>[[authorLabel]]</pl-badge>
          <pl-badge>Стрелочные связи</pl-badge>
          <pl-badge>Zoom + Pan + Центрирование</pl-badge>
        </pl-flex-layout>

        <div id="chartViewport" class="chart-viewport">
          <svg id="chartSvg" class="chart-svg"></svg>
        </div>
      </pl-flex-layout>
    </pl-flex-layout>
  `;

  constructor() {
    super();
    this._chartNodes = [];
    this._chartLinks = [];
    this._currentTransform = d3.zoomIdentity;
    this._chartKey = `orgchart-${Math.random().toString(36).slice(2, 10)}`;
    this._onSvgClickBound = this._onSvgClick.bind(this);
  }

  onConnect() {
    this._prepareSource();
    this._initChart();
    this._renderChart();
    this._bindSvgClick();
    this._bindResize();
    this.onCenterChart();
  }

  disconnectedCallback() {
    this._unbindSvgClick();
    this._unbindResize();
    super.disconnectedCallback();
  }

  _chartModeObserver() {
    this._renderChart();
    this.onCenterChart();
  }

  _prepareSource() {
    const departments = orgTreeRows();
    const people = peopleRows();
    const peopleMap = byId(people);
    const countByDepartment = people.reduce((acc, row) => {
      if (!row.departmentId) return acc;
      acc[row.departmentId] = (acc[row.departmentId] || 0) + 1;
      return acc;
    }, {});

    this._departments = departments.map((row) => {
      const head = peopleMap.get(row.headId);
      return {
        ...row,
        pid: row.parentId || null,
        employeeCount: Number(countByDepartment[row.id] || row.employeeCount || 0),
        head: this._personData(head)
      };
    });

    this._departmentById = byId(this._departments);

    const engHead = this._departmentById.get('dep-eng')?.head;
    this.authorLabel = engHead?.displayName
      ? `Разработка: ${engHead.displayName} (${engHead.title || 'руководитель'})`
      : 'Разработка: не назначен руководитель';
  }

  _personData(row) {
    if (!row) return {};
    return {
      id: row.id,
      displayName: row.displayName || row.name || 'Без имени',
      title: row.title || 'Руководитель',
      photoUrl: row.photoUrl || '',
      phone: row.contacts?.phone || '—',
      email: row.contacts?.email || '—',
      initials: initials(row.displayName || row.name)
    };
  }

  _initChart() {
    const svgNode = this.$?.chartSvg;
    if (!svgNode) return;

    this._svg = d3.select(svgNode);
    this._svg.attr('viewBox', `0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`);
    this._svg.attr('preserveAspectRatio', 'xMinYMin meet');
    this._svg.selectAll('*').remove();

    const defs = this._svg.append('defs');
    this._markerId = `${this._chartKey}-arrow`;
    this._patternId = `${this._chartKey}-dots`;

    defs.append('marker')
      .attr('id', this._markerId)
      .attr('viewBox', '0 0 10 10')
      .attr('refX', 8)
      .attr('refY', 5)
      .attr('markerWidth', 7)
      .attr('markerHeight', 7)
      .attr('orient', 'auto-start-reverse')
      .append('path')
      .attr('d', 'M 0 0 L 10 5 L 0 10 z')
      .attr('fill', 'rgba(90, 112, 142, 0.88)');

    const pattern = defs.append('pattern')
      .attr('id', this._patternId)
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 24)
      .attr('height', 24);

    pattern.append('rect')
      .attr('width', 24)
      .attr('height', 24)
      .attr('fill', '#f7faf8');

    pattern.append('circle')
      .attr('cx', 2)
      .attr('cy', 2)
      .attr('r', 1)
      .attr('fill', 'rgba(95, 117, 145, 0.28)');

    this._viewportLayer = this._svg.append('g').attr('class', 'chart-viewport-layer');
    this._viewportLayer.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', CANVAS_WIDTH)
      .attr('height', CANVAS_HEIGHT)
      .attr('rx', 14)
      .attr('ry', 14)
      .attr('fill', `url(#${this._patternId})`)
      .attr('stroke', 'rgba(42, 124, 113, 0.24)');

    this._linksLayer = this._viewportLayer.append('g').attr('class', 'links-layer');
    this._nodesLayer = this._viewportLayer.append('g').attr('class', 'nodes-layer');

    const extent = this._viewportExtent();

    this._zoom = d3.zoom()
      .scaleExtent([ZOOM_MIN, ZOOM_MAX])
      .extent(extent)
      .translateExtent([[-CANVAS_WIDTH, -CANVAS_HEIGHT], [CANVAS_WIDTH * 2, CANVAS_HEIGHT * 2]])
      .on('start', () => this._svg.classed('is-dragging', true))
      .on('end', () => this._svg.classed('is-dragging', false))
      .on('zoom', (event) => {
        this._currentTransform = event.transform;
        this.zoomPercent = Math.round(event.transform.k * 100);
        this._viewportLayer.attr('transform', event.transform.toString());
      });

    this._svg.call(this._zoom);
    this._svg.on('dblclick.zoom', null);
  }

  _renderChart() {
    if (!this._nodesLayer || !this._linksLayer) return;

    const spec = this.chartMode === 'legal' ? this._legalSpec() : this._operationalSpec();
    this._chartNodes = spec.nodes.map((node) => this._composeNode(node)).filter(Boolean);
    const nodeMap = byId(this._chartNodes);
    this._chartLinks = spec.links
      .map((link) => ({
        ...link,
        path: linkPath(nodeMap.get(link.source), nodeMap.get(link.target))
      }))
      .filter((link) => Boolean(link.path));

    const linkSelection = this._linksLayer
      .selectAll('path.org-link')
      .data(this._chartLinks, (d) => `${d.source}-${d.target}`);

    linkSelection.exit().remove();

    linkSelection.enter()
      .append('path')
      .attr('class', 'org-link')
      .attr('marker-end', `url(#${this._markerId})`)
      .merge(linkSelection)
      .attr('d', (d) => d.path);

    const nodeSelection = this._nodesLayer
      .selectAll('g.org-node')
      .data(this._chartNodes, (d) => d.id);

    nodeSelection.exit().remove();

    const nodeEnter = nodeSelection.enter()
      .append('g')
      .attr('class', 'org-node');

    nodeEnter.append('foreignObject')
      .attr('width', CARD_WIDTH)
      .attr('height', CARD_HEIGHT)
      .append('xhtml:div');

    const merged = nodeEnter.merge(nodeSelection)
      .attr('transform', (d) => `translate(${Math.round(d.x)},${Math.round(d.y)})`);

    merged.select('foreignObject')
      .attr('width', CARD_WIDTH)
      .attr('height', CARD_HEIGHT)
      .select('div')
      .html((d) => this._nodeHtml(d));
  }

  _operationalSpec() {
    return {
      nodes: [
        { id: 'dep-exec', depId: 'dep-exec', x: 790, y: 58 },
        { id: 'dep-hr', depId: 'dep-hr', x: 40, y: 338 },
        { id: 'dep-ops', depId: 'dep-ops', x: 392, y: 338 },
        { id: 'dep-prod', depId: 'dep-prod', x: 744, y: 338 },
        { id: 'dep-eng', depId: 'dep-eng', x: 1478, y: 338 },
        { id: 'dep-design', depId: 'dep-design', x: 744, y: 620 },
        { id: 'dep-data', depId: 'dep-data', x: 1478, y: 620 }
      ],
      links: [
        { source: 'dep-exec', target: 'dep-hr' },
        { source: 'dep-exec', target: 'dep-ops' },
        { source: 'dep-exec', target: 'dep-prod' },
        { source: 'dep-exec', target: 'dep-eng' },
        { source: 'dep-prod', target: 'dep-design' },
        { source: 'dep-eng', target: 'dep-data' }
      ]
    };
  }

  _legalSpec() {
    return {
      nodes: [
        {
          id: 'legal-root',
          title: 'ООО "Портал"',
          departmentIds: ['dep-exec', 'dep-prod', 'dep-eng', 'dep-design', 'dep-data', 'dep-ops', 'dep-hr'],
          headDepartmentId: 'dep-exec',
          x: 790,
          y: 58
        },
        {
          id: 'legal-board',
          title: 'Управляющая дирекция',
          departmentIds: ['dep-exec'],
          headDepartmentId: 'dep-exec',
          x: 214,
          y: 338
        },
        {
          id: 'legal-product',
          title: 'Продуктовый блок',
          departmentIds: ['dep-prod'],
          headDepartmentId: 'dep-prod',
          x: 566,
          y: 338
        },
        {
          id: 'legal-tech',
          title: 'Центр разработки',
          departmentIds: ['dep-eng'],
          headDepartmentId: 'dep-eng',
          x: 918,
          y: 338
        },
        {
          id: 'legal-services',
          title: 'Корпоративные сервисы',
          departmentIds: ['dep-ops', 'dep-hr'],
          headDepartmentId: 'dep-ops',
          x: 1270,
          y: 338
        },
        {
          id: 'legal-design',
          title: 'Дизайн-студия',
          departmentIds: ['dep-design'],
          headDepartmentId: 'dep-design',
          x: 566,
          y: 620
        },
        {
          id: 'legal-data',
          title: 'Центр данных и аналитики',
          departmentIds: ['dep-data'],
          headDepartmentId: 'dep-data',
          x: 918,
          y: 620
        }
      ],
      links: [
        { source: 'legal-root', target: 'legal-board' },
        { source: 'legal-root', target: 'legal-product' },
        { source: 'legal-root', target: 'legal-tech' },
        { source: 'legal-root', target: 'legal-services' },
        { source: 'legal-product', target: 'legal-design' },
        { source: 'legal-tech', target: 'legal-data' }
      ]
    };
  }

  _composeNode(spec) {
    if (!spec) return null;

    if (spec.depId) {
      const department = this._departmentById?.get(spec.depId);
      if (!department) return null;
      return {
        id: spec.id || department.id,
        x: spec.x,
        y: spec.y,
        title: department.name,
        employeeCount: department.employeeCount,
        countLabel: countLabel(department.employeeCount),
        departmentId: department.id,
        head: department.head || {}
      };
    }

    const departmentIds = Array.isArray(spec.departmentIds) ? spec.departmentIds : [];
    const employeeCount = departmentIds.reduce((sum, depId) => {
      return sum + Number(this._departmentById?.get(depId)?.employeeCount || 0);
    }, 0);
    const head = this._departmentById?.get(spec.headDepartmentId)?.head || {};

    return {
      id: spec.id,
      x: spec.x,
      y: spec.y,
      title: spec.title || 'Подразделение',
      employeeCount,
      countLabel: countLabel(employeeCount),
      departmentId: departmentIds.length === 1 ? departmentIds[0] : '',
      head
    };
  }

  _nodeHtml(node) {
    const title = escapeHtml(node.title || 'Подразделение');
    const count = escapeHtml(node.countLabel || '0 сотрудников');
    const depAttr = node.departmentId ? `data-department-id="${escapeHtml(node.departmentId)}"` : '';

    const head = node.head || {};
    const hasHead = Boolean(head.id);
    const avatar = head.photoUrl
      ? `<img src="${escapeHtml(head.photoUrl)}" alt="${escapeHtml(head.displayName || '')}">`
      : `<span>${escapeHtml(head.initials || '—')}</span>`;

    const headBlock = hasHead
      ? `
        <div class="node-head" data-employee-id="${escapeHtml(head.id)}">
          <span class="node-avatar">${avatar}</span>
          <span class="node-head-main">
            <span class="node-head-name">${escapeHtml(head.displayName || 'Без имени')}</span>
            <span class="node-head-role">${escapeHtml(head.title || 'Руководитель')}</span>
            <span class="node-head-contact">${escapeHtml(head.phone || '—')} · ${escapeHtml(head.email || '—')}</span>
          </span>
        </div>
      `
      : '';

    return `
      <div class="node-html ${node.departmentId ? 'clickable' : ''}" ${depAttr}>
        <div class="node-title">${title}</div>
        <div class="node-count">${count}</div>
        ${headBlock}
      </div>
    `;
  }

  _viewportExtent() {
    const viewport = this.$?.chartViewport;
    const width = Math.max(1, Number(viewport?.clientWidth || CANVAS_WIDTH));
    const height = Math.max(1, Number(viewport?.clientHeight || CANVAS_HEIGHT));
    return [[0, 0], [width, height]];
  }

  _bindResize() {
    if (this._resizeObserver || typeof ResizeObserver === 'undefined') return;
    this._resizeObserver = new ResizeObserver(() => {
      if (!this._zoom || !this._svg) return;
      this._zoom.extent(this._viewportExtent());
    });
    if (this.$?.chartViewport) this._resizeObserver.observe(this.$.chartViewport);
  }

  _unbindResize() {
    if (!this._resizeObserver) return;
    this._resizeObserver.disconnect();
    this._resizeObserver = null;
  }

  _bindSvgClick() {
    const svgNode = this.$?.chartSvg;
    if (!svgNode) return;
    svgNode.addEventListener('click', this._onSvgClickBound);
  }

  _unbindSvgClick() {
    const svgNode = this.$?.chartSvg;
    if (!svgNode) return;
    svgNode.removeEventListener('click', this._onSvgClickBound);
  }

  async _onSvgClick(event) {
    const target = event?.target;
    if (!target) return;

    const employeeEl = target.closest?.('[data-employee-id]');
    if (employeeEl?.dataset?.employeeId) {
      event.stopPropagation();
      await this.open('portal.employee_detail', { selectedId: employeeEl.dataset.employeeId });
      return;
    }

    const departmentEl = target.closest?.('[data-department-id]');
    if (departmentEl?.dataset?.departmentId) {
      await this.open('portal.department_detail', { selectedId: departmentEl.dataset.departmentId });
    }
  }

  _centerTransform(scale) {
    const viewport = this.$?.chartViewport;
    if (!viewport || !this._chartNodes.length) return d3.zoomIdentity;

    const rootId = this.chartMode === 'legal' ? 'legal-root' : 'dep-exec';
    const rootNode = this._chartNodes.find((node) => node.id === rootId) || this._chartNodes[0];
    const k = clamp(scale, ZOOM_MIN, ZOOM_MAX);

    const tx = (viewport.clientWidth / 2) - ((rootNode.x + (CARD_WIDTH / 2)) * k);
    const ty = 40 - (rootNode.y * k);

    return d3.zoomIdentity.translate(Math.round(tx), Math.round(ty)).scale(k);
  }

  _applyTransform(transform, animated = false) {
    if (!this._svg || !this._zoom) return;
    if (animated) {
      this._svg.transition().duration(220).call(this._zoom.transform, transform);
    } else {
      this._svg.call(this._zoom.transform, transform);
    }
  }

  onZoomIn() {
    if (!this._svg || !this._zoom) return;
    const viewport = this.$?.chartViewport;
    const center = [Math.max(1, (viewport?.clientWidth || 0) / 2), Math.max(1, (viewport?.clientHeight || 0) / 2)];
    this._svg.transition().duration(160).call(this._zoom.scaleBy, 1.15, center);
  }

  onZoomOut() {
    if (!this._svg || !this._zoom) return;
    const viewport = this.$?.chartViewport;
    const center = [Math.max(1, (viewport?.clientWidth || 0) / 2), Math.max(1, (viewport?.clientHeight || 0) / 2)];
    this._svg.transition().duration(160).call(this._zoom.scaleBy, 0.87, center);
  }

  onCenterChart() {
    const transform = this._centerTransform(this._currentTransform?.k || 1);
    this._applyTransform(transform, true);
  }
}
