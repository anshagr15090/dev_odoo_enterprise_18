from odoo import models, fields

class ResPartnerInherit(models.Model):
    _inherit = 'res.partner'

    is_patient = fields.Boolean(string="Is Patient", default=False, invisible=True)
    is_donor = fields.Boolean(string="Is Donor", default=False, invisible=True)

    donor_type_id = fields.Many2one(
        'bsms.donor.type', 
        string='Donor Type',
        help="Select the type of donor."
    )

